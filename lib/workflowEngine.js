
import { baseWorkflow } from "./workflow";

 

export function applyParams(params) {
  const workflow = structuredClone(baseWorkflow);

  // Set the prompt
  workflow["58"].inputs.value = params.prompt;

  // Set the negative prompt
  if (params.negativePrompt) {
    //
  }

  // Set the seed
  workflow["57:3"].inputs.seed = params.seed ?? Math.floor(Math.random() * 1e15);

  // Set the width and height
  if (params.width) {
    workflow["5"].inputs.width = params.width;
  }
  if (params.height) {
    workflow["5"].inputs.height = params.height;
  }

  return workflow;
}
