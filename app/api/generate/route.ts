
import { NextResponse } from "next/server";
import { applyParams } from "@/lib/workflowEngine";
import { submitWorkflow, getHistory } from "@/lib/comfyClient";

export async function POST(req: Request) {
  try {
    const params = await req.json();
    const workflow = applyParams(params);
    const submitResponse = await submitWorkflow(workflow);

    if (submitResponse.error) {
      return NextResponse.json(
        { message: "Error submitting workflow", error: submitResponse.error },
        { status: 500 }
      );
    }

    const promptId = submitResponse.prompt_id;

    // Poll for the result
    let history;
    let attempts = 0;
    const maxAttempts = 60;
    const interval = 1000;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      history = await getHistory(promptId);
      if (Object.keys(history).length > 0) {
        break;
      }
      attempts++;
    }

    if (!history || Object.keys(history).length === 0) {
      return NextResponse.json(
        { message: "Error getting history" },
        { status: 500 }
      );
    }

    const historyEntry = history[promptId];
    const outputs = historyEntry.outputs;
    const image = outputs["9"].images[0];
    const imageUrl = `http://127.0.0.1:8188/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
