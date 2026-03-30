
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

  // Set the resolution
  if (params.width && params.height) {
    workflow["57:13"].inputs.width = params.width;
    workflow["57:13"].inputs.height = params.height;
  }

  // Set the batch size
  if (params.batch_size) {
    workflow["57:13"].inputs.batch_size = params.batch_size;
  }

 

  return workflow;
}
