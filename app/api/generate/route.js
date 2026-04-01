
import { NextResponse } from "next/server";
import { applyParams } from "@/lib/workflowEngine";
import { submitWorkflow, getHistory, COMFYUI_URL } from "@/lib/comfyClient";
import { query } from "@/lib/db";
import { initDb } from "@/lib/initDb";

export async function POST(req) {
  try {
    // DB init — best-effort, never blocks generation
    try { await initDb(); } catch (dbErr) {
      console.error("[generate] DB init failed (generation will proceed):", dbErr.message);
    }

    const params = await req.json();
    const { clientId, ...genParams } = params;
    console.log("Received params:", genParams);

    const workflow = applyParams(genParams);
    console.log("Applied workflow:", JSON.stringify(workflow, null, 2));

    const submitResponse = await submitWorkflow(workflow, clientId);
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
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      history = await getHistory(promptId);
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

    // Finding all image outputs
    const imageUrls = [];
    for (const key in outputs) {
      if (outputs[key].images) {
        console.log(`Found images in output node: ${key}`);
        for (const image of outputs[key].images) {
          const imageUrl = `${COMFYUI_URL}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`;
          imageUrls.push(imageUrl);
        }
      }
    }

    if (imageUrls.length === 0) {
      console.error("No images found in outputs");
      return NextResponse.json(
        { message: "No images found in workflow output" },
        { status: 500 }
      );
    }

    console.log("Constructed image URLs:", imageUrls);

    // Persist each image to the database (best-effort)
    try {
      const resolution = params.width && params.height
        ? `${params.width}x${params.height}`
        : null;

      for (const url of imageUrls) {
        await query(
          "INSERT INTO generated_images (prompt, image_url, resolution) VALUES (?, ?, ?)",
          [params.prompt, url, resolution]
        );
      }
      console.log(`Saved ${imageUrls.length} image(s) to DB.`);
    } catch (dbErr) {
      console.error("[generate] DB save failed (image still returned):", dbErr.message);
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
