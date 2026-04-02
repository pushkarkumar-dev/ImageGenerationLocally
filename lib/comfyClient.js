export const COMFYUI_URL = "http://192.168.0.158:8188";
export const COMFYUI_URL_2 = "http://192.168.0.158:8189";

// Derive WebSocket URL from the HTTP URL
export const COMFYUI_WS_URL = COMFYUI_URL.replace(/^http/, "ws");

/**
 * @param {object} workflow  - ComfyUI API-format workflow
 * @param {string} [clientId] - optional UUID to receive WebSocket progress events
 * @param {string} [serverUrl] - target server URL
 */
export async function submitWorkflow(workflow, clientId, serverUrl = COMFYUI_URL) {
  const body = { prompt: workflow };
  if (clientId) body.client_id = clientId;

  const response = await fetch(`${serverUrl}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * Upload an image or video file to ComfyUI for processing
 * @param {Blob|File} file - Data to upload
 * @param {string} filename - Desired filename
 * @param {string} serverUrl - target server URL
 * @returns {Promise<{name: string}>}
 */
export async function uploadFile(file, filename, serverUrl = COMFYUI_URL) {
  const formData = new FormData();
  formData.append("image", file, filename);
  formData.append("overwrite", "true");

  const response = await fetch(`${serverUrl}/upload/image`, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function getHistory(promptId, serverUrl = COMFYUI_URL) {
  const response = await fetch(`${serverUrl}/history/${promptId}`);
  return response.json();
}
