// Provide a dummy workflow that expects a "LoadImage" or "LoadVideo" node,
// and a "SaveText" or "ShowText" node. The user should replace these with their real workflows.

export const imageCaptionWorkflow = {
  "7": {
    "inputs": {
      "image_path_or_URL": "",
      "image": "IMG_5684.jpg",
      "upscale_method": "lanczos",
      "megapixels": 1,
      "scale_by": 1,
      "resize_mode": "longest_side",
      "size": 0
    },
    "class_type": "AILab_LoadImage",
    "_meta": {
      "title": "Load Image (RMBG) 🖼️"
    }
  },
  "12": {
    "inputs": {
      "preview_markdown": "A person wearing a red cropped top and shiny blue jeans stands indoors, showing their midsection against a plain wall background.",
      "preview_text": "A person wearing a red cropped top and shiny blue jeans stands indoors, showing their midsection against a plain wall background.",
      "previewMode": null,
      "source": [
        "14",
        0
      ]
    },
    "class_type": "PreviewAny",
    "_meta": {
      "title": "Preview as Text"
    }
  },
  "14": {
    "inputs": {
      "model_name": "Qwen3-VL-8B-Instruct-FP8",
      "quantization": "None (FP16)",
      "attention_mode": "sage",
      "preset_prompt": "🖼️ Simple Description",
      "custom_prompt": "",
      "max_tokens": 2048,
      "keep_model_loaded": 412458316500275,
      "seed": 3393288872,
      "image": [
        "7",
        0
      ]
    },
    "class_type": "AILab_QwenVL",
    "_meta": {
      "title": "QwenVL"
    }
  },
  "17": {
    "inputs": {
      "filename_prefix": "text",
      "output_folder": "output",
      "file_extension": ".txt",
      "string": [
        "14",
        0
      ]
    },
    "class_type": "SaveStringKJ",
    "_meta": {
      "title": "Save String KJ (Swwan)"
    }
  }
};

export const videoCaptionWorkflow = {
  "11": {
    "inputs": {
      "video": "a5.mp4",
      "force_rate": 0,
      "custom_width": 0,
      "custom_height": 0,
      "frame_load_cap": 0,
      "skip_first_frames": 0,
      "select_every_nth": 1,
      "format": "AnimateDiff"
    },
    "class_type": "VHS_LoadVideo",
    "_meta": {
      "title": "Load Video (Upload) 🎥🅥🅗🅢"
    }
  },
  "13": {
    "inputs": {
      "preview_markdown": "",
      "preview_text": "",
      "previewMode": null,
      "source": [
        "18",
        0
      ]
    },
    "class_type": "PreviewAny",
    "_meta": {
      "title": "Preview as Text"
    }
  },
  "18": {
    "inputs": {
      "model_name": "Qwen3-VL-8B-Instruct-FP8",
      "quantization": "None (FP16)",
      "attention_mode": "sage",
      "preset_prompt": "🖼️ Simple Description",
      "custom_prompt": "",
      "max_tokens": 2048,
      "keep_model_loaded": false,
      "seed": 3356742687,
      "video": [
        "11",
        0
      ]
    },
    "class_type": "AILab_QwenVL",
    "_meta": {
      "title": "QwenVL"
    }
  }
};

/**
 * Given the filename from ComfyUI upload, prepare the image-to-text workflow
 */
export function applyImageCaptionParams(filename, customPrompt = "") {
  const workflow = structuredClone(imageCaptionWorkflow);
  
  // Find the LoadImage node to inject the filename.
  const loadNodeId = Object.keys(workflow).find(k => 
    workflow[k].class_type === "LoadImage" || workflow[k].class_type === "AILab_LoadImage"
  );
  if (loadNodeId) {
    workflow[loadNodeId].inputs.image = filename;
  }

  // Find the QwenVL node to inject custom prompt if provided
  if (customPrompt) {
    const qwenNodeId = Object.keys(workflow).find(k => workflow[k].class_type === "AILab_QwenVL");
    if (qwenNodeId) {
      workflow[qwenNodeId].inputs.custom_prompt = customPrompt;
    }
  }

  return workflow;
}

/**
 * Given the filename from ComfyUI upload, prepare the video-to-text workflow
 */
export function applyVideoCaptionParams(filename, customPrompt = "") {
  const workflow = structuredClone(videoCaptionWorkflow);

  const loadNodeId = Object.keys(workflow).find(k => workflow[k].class_type === "VHS_LoadVideo");
  if (loadNodeId) {
    workflow[loadNodeId].inputs.video = filename;
  }

  // Find the QwenVL node to inject custom prompt if provided
  if (customPrompt) {
    const qwenNodeId = Object.keys(workflow).find(k => workflow[k].class_type === "AILab_QwenVL");
    if (qwenNodeId) {
      workflow[qwenNodeId].inputs.custom_prompt = customPrompt;
    }
  }

  return workflow;
}
