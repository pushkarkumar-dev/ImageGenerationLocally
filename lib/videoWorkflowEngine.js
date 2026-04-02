
import { baseVideoWorkflow } from "./videoWorkflow";

export function applyParamsToVideoWorkflow(params) {
  console.log("Applying params to video workflow:", params);
  const workflow = structuredClone(baseVideoWorkflow);

  // Set the prompt
  workflow["375"].inputs.text = params.prompt;

  // Set Width and Height if provided
  if (params.width && workflow["292"]) {
    workflow["292"].inputs.value = parseInt(params.width, 10);
  }
  if (params.height && workflow["293"]) {
    workflow["293"].inputs.value = parseInt(params.height, 10);
  }

  // Set the seed
  // workflow["2"].inputs.seed = params.seed ?? Math.floor(Math.random() * 1e15);

  console.log("Resulting workflow:", workflow);
  return workflow;
}
