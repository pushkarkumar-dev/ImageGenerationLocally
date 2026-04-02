import { NextResponse } from "next/server";
import { uploadFile, submitWorkflow, getHistory } from "@/lib/comfyClient";
import { applyVideoCaptionParams } from "@/lib/captionWorkflows";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const clientId = formData.get("clientId");
    const serverUrl = formData.get("serverUrl");
    const customPrompt = formData.get("customPrompt") || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Upload to ComfyUI
    const uploadRes = await uploadFile(file, file.name || "video.mp4", serverUrl);
    if (!uploadRes.name) throw new Error("File upload to ComfyUI failed");

    // 2. Prepare workflow
    const workflow = applyVideoCaptionParams(uploadRes.name, customPrompt);

    // 3. Submit workflow
    const submitResponse = await submitWorkflow(workflow, clientId, serverUrl);
    if (submitResponse.error) throw new Error(submitResponse.error);

    const promptId = submitResponse.prompt_id;

    // 4. Wait for it to finish
    let history;
    let attempts = 0;
    while (attempts < 240) { // Video might take longer
      await new Promise(r => setTimeout(r, 1000));
      history = await getHistory(promptId, serverUrl);
      if (Object.keys(history).length > 0) break;
      attempts++;
    }

    if (!history || Object.keys(history).length === 0) {
      throw new Error("Timeout getting result from ComfyUI");
    }

    // 5. Extract text
    const outputs = history[promptId].outputs || {};
    let captionText = "Failed to extract text from workflow output.";

    for (const nodeId in outputs) {
      const out = outputs[nodeId];
      if (out.text && Array.isArray(out.text) && out.text.length > 0) {
        captionText = out.text.join("\n");
        break;
      }
      if (out.string && Array.isArray(out.string) && out.string.length > 0) {
        captionText = out.string.join("\n");
        break;
      }
    }

    return NextResponse.json({ caption: captionText });
  } catch (error) {
    console.error("[caption-video]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
