
import { baseWorkflow } from "./workflow";

interface Params {
  prompt: string;
  negativePrompt?: string;
  steps?: number;
  cfg?: number;
  seed?: number;
  width?: number;
  height?: number;
}

export function applyParams(params: Params) {
  const workflow = structuredClone(baseWorkflow);

  // Set the prompt
  workflow["6"].inputs.text = params.prompt;

  // Set the negative prompt
  if (params.negativePrompt) {
    workflow["7"].inputs.text = params.negativePrompt;
  }

  // Set the steps
  if (params.steps) {
    workflow["3"].inputs.steps = params.steps;
  }

  // Set the cfg
  if (params.cfg) {
    workflow["3"].inputs.cfg = params.cfg;
  }

  // Set the seed
  workflow["3"].inputs.seed = params.seed ?? Math.floor(Math.random() * 1e15);

  // Set the width and height
  if (params.width) {
    workflow["5"].inputs.width = params.width;
  }
  if (params.height) {
    workflow["5"].inputs.height = params.height;
  }

  return workflow;
}
