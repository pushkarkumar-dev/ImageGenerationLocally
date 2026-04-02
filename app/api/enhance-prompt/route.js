import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { basePrompt, modifiers, mediaType } = body;

    if (!basePrompt) {
      return NextResponse.json({ error: "Missing base prompt" }, { status: 400 });
    }

    const systemInstructions = mediaType === "video" 
      ? "You are an expert AI Video Director. Your task is to take a base idea and list of modifiers and write a highly descriptive, cinematic, comma-separated prompt for a Text-to-Video generation model. Focus heavily on continuous motion, camera panning, lighting, and temporal consistency. Do not output anything except the final prompt string."
      : "You are an expert AI Prompt Engineer for Stable Diffusion models. Your task is to take a base idea and a list of modifiers and weave them into a gorgeous, highly detailed, comma-separated image generation prompt. Focus heavily on lighting, composition, renderer style, and resolution parameters. Do not output anything except the final prompt string.";

    const userInstructions = `
Base Idea: ${basePrompt}

Modifiers to Include:
- Art Style: ${modifiers.style || "None"}
- Lighting: ${modifiers.lighting || "None"}
- Camera/Lens: ${modifiers.camera || "None"}
- Scene/Vibe: ${modifiers.vibe || "None"}
- Extra Keywords: ${modifiers.extra || "None"}

Generate the ultimate prompt now:
`;

    const lmResponse = await fetch("http://192.168.0.201:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-vl-30b",
        messages: [
          { role: "system", content: systemInstructions },
          { role: "user", content: userInstructions }
        ],
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      })
    });

    if (!lmResponse.ok) {
      const err = await lmResponse.text();
      return NextResponse.json({ error: `LMStudio Error: ${err}` }, { status: 500 });
    }

    const data = await lmResponse.json();
    const enhancedPrompt = data.choices[0].message.content.trim();

    return NextResponse.json({ enhancedPrompt });

  } catch (error) {
    console.error("[enhance-prompt]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
