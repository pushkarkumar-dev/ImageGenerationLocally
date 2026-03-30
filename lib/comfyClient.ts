
const COMFYUI_URL = "http://127.0.0.1:8188";

export async function submitWorkflow(workflow: any) {
  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: workflow }),
  });
  return response.json();
}

export async function getHistory(promptId: string) {
  const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
  return response.json();
}
