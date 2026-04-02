
import { NextResponse } from "next/server";
import { applyParamsToVideoWorkflow } from "@/lib/videoWorkflowEngine";
import { submitWorkflow, getHistory, COMFYUI_URL } from "@/lib/comfyClient";
import { query } from "@/lib/db";
import { initDb } from "@/lib/initDb";

export async function POST(req) {
  try {
    // DB init — best-effort, never blocks generation
    try { await initDb(); } catch (dbErr) {
      console.error("[generate-video] DB init failed (generation will proceed):", dbErr.message);
    }

    const params = await req.json();
    const { clientId, serverUrl, ...genParams } = params;
    console.log("Received params for video generation:", genParams);

    const workflow = applyParamsToVideoWorkflow(genParams);
    console.log("Applied video workflow:", JSON.stringify(workflow, null, 2));

    const submitResponse = await submitWorkflow(workflow, clientId, serverUrl);
    console.log("Submit response:", submitResponse);

    if (submitResponse.error) {
      console.error("Error submitting workflow:", submitResponse.error);
      return NextResponse.json(
        { message: "Error submitting workflow", error: submitResponse.error },
        { status: 500 }
      );
    }

    const promptId = submitResponse.prompt_id;
    console.log("Submitted prompt with ID:", promptId);

    // Poll for the result
    let history;
    let attempts = 0;
    const maxAttempts = 120;
    const interval = 1000;

    console.log(`Polling for results for prompt ID: ${promptId}`);
    while (attempts < maxAttempts) { // Allow up to double time for video
      await new Promise((resolve) => setTimeout(resolve, interval));
      history = await getHistory(promptId, serverUrl);
      if (Object.keys(history).length > 0) {
        console.log(`Received history for prompt ID: ${promptId}`);
        break;
      }
      attempts++;
      console.log(`Attempt ${attempts} - still waiting for results...`);
    }

    if (!history || Object.keys(history).length === 0) {
      console.error("Failed to get history for prompt ID:", promptId);
      return NextResponse.json(
        { message: "Error getting history" },
        { status: 500 }
      );
    }

    console.log("Full history response:", JSON.stringify(history, null, 2));

    const historyEntry = history[promptId];
    console.log("History entry:", JSON.stringify(historyEntry, null, 2));

    const outputs = historyEntry.outputs;
    console.log("Outputs:", JSON.stringify(outputs, null, 2));

    // Finding all video outputs
    const videoUrls = [];
    for (const key in outputs) {
      if (outputs[key].gifs) {
        console.log(`Found gifs in output node: ${key}`);
        for (const video of outputs[key].gifs) {
          const videoUrl = `${COMFYUI_URL}/view?filename=${video.filename}&subfolder=${video.subfolder}&type=${video.type}`;
          videoUrls.push(videoUrl);
        }
      }
    }

    if (videoUrls.length === 0) {
      console.error("No videos found in outputs");
      return NextResponse.json(
        { message: "No videos found in workflow output" },
        { status: 500 }
      );
    }

    console.log("Constructed video URLs:", videoUrls);

    // Persist each video to the database (best-effort)
    try {
      for (const url of videoUrls) {
        await query(
          "INSERT INTO generated_videos (prompt, video_url) VALUES (?, ?)",
          [params.prompt, url]
        );
      }
      console.log(`Saved ${videoUrls.length} video(s) to DB.`);
    } catch (dbErr) {
      console.error("[generate-video] DB save failed (video still returned):", dbErr.message);
    }

    return NextResponse.json({ videoUrls });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
