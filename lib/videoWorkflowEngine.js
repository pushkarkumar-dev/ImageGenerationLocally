
import { baseVideoWorkflow } from "./videoWorkflow";

export function applyParamsToVideoWorkflow(params) {
  console.log("Applying params to video workflow:", params);
  const workflow = structuredClone(baseVideoWorkflow);

  // Set the prompt
  workflow["375"].inputs.text = params.prompt;

  // Set the seed
  // workflow["2"].inputs.seed = params.seed ?? Math.floor(Math.random() * 1e15);

  console.log("Resulting workflow:", workflow);
  return workflow;
}
