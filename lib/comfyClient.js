
export const COMFYUI_URL = "http://192.168.0.158:8188";
// Derive WebSocket URL from the HTTP URL
export const COMFYUI_WS_URL = COMFYUI_URL.replace(/^http/, "ws");

/**
 * @param {object} workflow  - ComfyUI API-format workflow
 * @param {string} [clientId] - optional UUID to receive WebSocket progress events
 */
export async function submitWorkflow(workflow, clientId) {
  const body = { prompt: workflow };
  if (clientId) body.client_id = clientId;

  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getHistory(promptId) {
  const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
  return response.json();
}
