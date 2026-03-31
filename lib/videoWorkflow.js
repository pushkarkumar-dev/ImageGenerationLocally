
export const baseVideoWorkflow = {
  "100": {
    "inputs": {
      "sigmas": "0.909375, 0.725, 0.421875, 0.0"
    },
    "class_type": "ManualSigmas",
    "_meta": {
      "title": "ManualSigmas (LTX 2.0)"
    }
  },
  "103": {
    "inputs": {
      "cfg": 1,
      "model": [
        "342",
        0
      ],
      "positive": [
        "107",
        0
      ],
      "negative": [
        "107",
        1
      ]
    },
    "class_type": "CFGGuider",
    "_meta": {
      "title": "CFGGuider"
    }
  },
  "107": {
    "inputs": {
      "frame_rate": [
        "285",
        0
      ],
      "positive": [
        "121",
        0
      ],
      "negative": [
        "110",
        0
      ]
    },
    "class_type": "LTXVConditioning",
    "_meta": {
      "title": "LTXVConditioning"
    }
  },
  "108": {
    "inputs": {
      "width": [
        "361",
        1
      ],
      "height": [
        "363",
        1
      ],
      "length": [
        "287",
        1
      ],
      "batch_size": 1
    },
    "class_type": "EmptyLTXVLatentVideo",
    "_meta": {
      "title": "EmptyLTXVLatentVideo"
    }
  },
  "109": {
    "inputs": {
      "video_latent": [
        "108",
        0
      ],
      "audio_latent": [
        "199",
        0
      ]
    },
    "class_type": "LTXVConcatAVLatent",
    "_meta": {
      "title": "LTXVConcatAVLatent"
    }
  },
  "110": {
    "inputs": {
      "text": "blurry, oversaturated, pixelated, low resolution, grainy, distorted, noise, compression artifacts, jpeg artifacts, glitches, watermark, text, logo, signature, copyright, subtitles, distorted sound, saturated sound, loud",
      "clip": [
        "190",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "113": {
    "inputs": {
      "noise": [
        "115",
        0
      ],
      "guider": [
        "129",
        0
      ],
      "sampler": [
        "137",
        0
      ],
      "sigmas": [
        "366",
        0
      ],
      "latent_image": [
        "109",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "114": {
    "inputs": {
      "noise_seed": 420
    },
    "class_type": "RandomNoise",
    "_meta": {
      "title": "RandomNoise"
    }
  },
  "115": {
    "inputs": {
      "noise_seed": 43
    },
    "class_type": "RandomNoise",
    "_meta": {
      "title": "RandomNoise"
    }
  },
  "116": {
    "inputs": {
      "av_latent": [
        "113",
        0
      ]
    },
    "class_type": "LTXVSeparateAVLatent",
    "_meta": {
      "title": "LTXVSeparateAVLatent"
    }
  },
  "117": {
    "inputs": {
      "video_latent": [
        "118",
        0
      ],
      "audio_latent": [
        "116",
        1
      ]
    },
    "class_type": "LTXVConcatAVLatent",
    "_meta": {
      "title": "LTXVConcatAVLatent"
    }
  },
  "118": {
    "inputs": {
      "samples": [
        "116",
        0
      ],
      "upscale_model": [
        "189",
        0
      ],
      "vae": [
        "184",
        0
      ]
    },
    "class_type": "LTXVLatentUpsampler",
    "_meta": {
      "title": "spatial"
    }
  },
  "119": {
    "inputs": {
      "noise": [
        "114",
        0
      ],
      "guider": [
        "103",
        0
      ],
      "sampler": [
        "138",
        0
      ],
      "sigmas": [
        "367",
        0
      ],
      "latent_image": [
        "117",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "121": {
    "inputs": {
      "text": [
        "378",
        0
      ],
      "clip": [
        "190",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "125": {
    "inputs": {
      "av_latent": [
        "119",
        0
      ]
    },
    "class_type": "LTXVSeparateAVLatent",
    "_meta": {
      "title": "LTXVSeparateAVLatent"
    }
  },
  "127": {
    "inputs": {
      "tile_size": 512,
      "overlap": 64,
      "temporal_size": 4096,
      "temporal_overlap": 8,
      "samples": [
        "125",
        0
      ],
      "vae": [
        "184",
        0
      ]
    },
    "class_type": "VAEDecodeTiled",
    "_meta": {
      "title": "VAE Decode (Tiled)"
    }
  },
  "129": {
    "inputs": {
      "cfg": 1,
      "model": [
        "342",
        0
      ],
      "positive": [
        "107",
        0
      ],
      "negative": [
        "107",
        1
      ]
    },
    "class_type": "CFGGuider",
    "_meta": {
      "title": "CFGGuider"
    }
  },
  "137": {
    "inputs": {
      "sampler_name": "euler_ancestral_cfg_pp"
    },
    "class_type": "KSamplerSelect",
    "_meta": {
      "title": "KSamplerSelect"
    }
  },
  "138": {
    "inputs": {
      "sampler_name": "lcm"
    },
    "class_type": "KSamplerSelect",
    "_meta": {
      "title": "KSamplerSelect"
    }
  },
  "140": {
    "inputs": {
      "frame_rate": [
        "285",
        0
      ],
      "loop_count": 0,
      "filename_prefix": "LTX-2",
      "format": "video/h264-mp4",
      "pix_fmt": "yuv420p",
      "crf": 19,
      "save_metadata": true,
      "trim_to_audio": false,
      "pingpong": false,
      "save_output": true,
      "images": [
        "127",
        0
      ],
      "audio": [
        "201",
        0
      ]
    },
    "class_type": "VHS_VideoCombine",
    "_meta": {
      "title": "Video Combine 🎥🅥🅗🅢"
    }
  },
  "184": {
    "inputs": {
      "vae_name": "LTX23_video_vae_bf16.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Load VAE (video VAE)"
    }
  },
  "189": {
    "inputs": {
      "model_name": "ltx-2.3-spatial-upscaler-x2-1.0.safetensors"
    },
    "class_type": "LatentUpscaleModelLoader",
    "_meta": {
      "title": "Load Latent Upscale Model"
    }
  },
  "190": {
    "inputs": {
      "clip_name1": "gemma_3_12B_it_fp4_mixed.safetensors",
      "clip_name2": "ltx-2.3_text_projection_bf16.safetensors",
      "type": "ltxv",
      "device": "default"
    },
    "class_type": "DualCLIPLoader",
    "_meta": {
      "title": "CLIPLoader (Gemma + LTX Embeddings)"
    }
  },
  "196": {
    "inputs": {
      "vae_name": "LTX23_audio_vae_bf16.safetensors",
      "device": "main_device",
      "weight_dtype": "bf16"
    },
    "class_type": "VAELoaderKJ",
    "_meta": {
      "title": "VAELoader KJ (audio VAE)"
    }
  },
  "199": {
    "inputs": {
      "frames_number": [
        "287",
        1
      ],
      "frame_rate": [
        "311",
        1
      ],
      "batch_size": 1,
      "audio_vae": [
        "196",
        0
      ]
    },
    "class_type": "LTXVEmptyLatentAudio",
    "_meta": {
      "title": "LTXV Empty Latent Audio"
    }
  },
  "201": {
    "inputs": {
      "samples": [
        "125",
        1
      ],
      "audio_vae": [
        "196",
        0
      ]
    },
    "class_type": "LTXVAudioVAEDecode",
    "_meta": {
      "title": "LTXV Audio VAE Decode"
    }
  },
  "206": {
    "inputs": {
      "steps": 8,
      "max_shift": 2.05,
      "base_shift": 0.95,
      "stretch": true,
      "terminal": 0.1,
      "latent": [
        "109",
        0
      ]
    },
    "class_type": "LTXVScheduler",
    "_meta": {
      "title": "LTXVScheduler (for more steps)"
    }
  },
  "285": {
    "inputs": {
      "value": 24
    },
    "class_type": "PrimitiveFloat",
    "_meta": {
      "title": "FPS"
    }
  },
  "287": {
    "inputs": {
      "expression": "1+ 8*(round(a*b)/8)",
      "a": [
        "291",
        0
      ],
      "b": [
        "285",
        0
      ]
    },
    "class_type": "SimpleCalculatorKJ",
    "_meta": {
      "title": "SimpleCalculatorKJ"
    }
  },
  "291": {
    "inputs": {
      "value": 5
    },
    "class_type": "INTConstant",
    "_meta": {
      "title": "LENGTH (in seconds)"
    }
  },
  "292": {
    "inputs": {
      "value": 1920
    },
    "class_type": "INTConstant",
    "_meta": {
      "title": "WIDTH"
    }
  },
  "293": {
    "inputs": {
      "value": 1088
    },
    "class_type": "INTConstant",
    "_meta": {
      "title": "HEIGHT"
    }
  },
  "301": {
    "inputs": {
      "PowerLoraLoaderHeaderWidget": {
        "type": "PowerLoraLoaderHeaderWidget"
      },
      "➕ Add Lora": "",
      "model": [
        "329",
        0
      ]
    },
    "class_type": "Power Lora Loader (rgthree)",
    "_meta": {
      "title": "Power Lora Loader (rgthree)"
    }
  },
  "311": {
    "inputs": {
      "expression": "a",
      "variables.a": [
        "285",
        0
      ]
    },
    "class_type": "SimpleCalculatorKJ",
    "_meta": {
      "title": "SimpleCalculatorKJ"
    }
  },
  "329": {
    "inputs": {
      "unet_name": "ltx2.3\\ltx-2.3-22b-distilled_transformer_only_fp8_input_scaled_v2.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "330": {
    "inputs": {
      "vae_name": "vae_approx\\taeltx2_3.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Tiny VAE (for sampler previews)"
    }
  },
  "342": {
    "inputs": {
      "nag_scale": 11,
      "nag_alpha": 0.25,
      "nag_tau": 2.5,
      "inplace": true,
      "model": [
        "301",
        0
      ],
      "nag_cond_video": [
        "107",
        1
      ],
      "nag_cond_audio": [
        "107",
        1
      ]
    },
    "class_type": "LTX2_NAG",
    "_meta": {
      "title": "LTX2 NAG"
    }
  },
  "345": {
    "inputs": {
      "unet_name": "LTXvideo\\LTX-2\\quantstack\\LTX-2.3-distilled-Q4_K_S.gguf"
    },
    "class_type": "UnetLoaderGGUF",
    "_meta": {
      "title": "Unet Loader (GGUF)"
    }
  },
  "346": {
    "inputs": {
      "clip_name1": "gemma-3-12b-it-Q2_K.gguf",
      "clip_name2": "ltx-2.3_text_projection_bf16.safetensors",
      "type": "sdxl"
    },
    "class_type": "DualCLIPLoaderGGUF",
    "_meta": {
      "title": "CLIP GGUF (Gemma + text projection)"
    }
  },
  "361": {
    "inputs": {
      "expression": "a * 0.5",
      "variables.a": [
        "292",
        0
      ]
    },
    "class_type": "SimpleCalculatorKJ",
    "_meta": {
      "title": "SimpleCalculatorKJ"
    }
  },
  "363": {
    "inputs": {
      "expression": "a * 0.5",
      "variables.a": [
        "293",
        0
      ]
    },
    "class_type": "SimpleCalculatorKJ",
    "_meta": {
      "title": "SimpleCalculatorKJ"
    }
  },
  "366": {
    "inputs": {
      "sigmas": "1.0, 0.99375, 0.9875, 0.98125, 0.975, 0.909375, 0.725, 0.421875, 0.0"
    },
    "class_type": "ManualSigmas",
    "_meta": {
      "title": "ManualSigmas"
    }
  },
  "367": {
    "inputs": {
      "sigmas": "0.85, 0.7250, 0.4219, 0.0"
    },
    "class_type": "ManualSigmas",
    "_meta": {
      "title": "ManualSigmas"
    }
  },
  "375": {
    "inputs": {
      "text": "A elephant swimming in a river."
    },
    "class_type": "Textbox",
    "_meta": {
      "title": "InputPrompt"
    }
  },
  "377": {
    "inputs": {
      "string_a": "You are an expert cinematic prompt engineer and award-winning Hollywood director. Your task is to transform simple user prompts into rich, visually stunning, highly detailed text-to-video prompts suitable for advanced generative video models.\n\nWhen enhancing a prompt, you must:\n\nExpand Visual Detail\nAdd vivid descriptions of characters, environments, lighting, weather, textures, and atmosphere.\nSpecify time of day, season, and environmental conditions.\nCinematography & Camera Work\nInclude camera angles (wide shot, close-up, aerial, tracking shot, dolly, handheld, etc.).\nDescribe camera movement and framing.\nMention lens types (e.g., 35mm, 85mm, anamorphic) and depth of field.\nLighting & Color Grading\nDefine lighting style (soft, dramatic, high-contrast, rim lighting, golden hour, neon-lit, etc.).\nInclude color palettes and cinematic grading (teal & orange, desaturated, warm tones, etc.).\nAction & Motion\nMake scenes dynamic by describing movement of subjects, background elements, and physics.\nAdd natural motion like wind, particles, reflections, or environmental interactions.\nMood & Emotion\nEstablish tone (epic, suspenseful, romantic, eerie, inspirational, etc.).\nDescribe character expressions and emotional beats.\nProduction Quality\nExplicitly state “cinematic”, “ultra-realistic”, “high budget”, “Hollywood-level production”.\nInclude details like CGI quality, practical effects, or film grain if relevant.\nSound Design (Optional but encouraged)\nAdd ambient sounds, music style, or sound effects when appropriate.\nStructure\nOutput a single polished paragraph or short multi-paragraph prompt.\nDo NOT explain your changes.\nDo NOT include bullet points.\nOnly output the final enhanced prompt.\nStyle Consistency\nMatch the genre and intent of the original prompt.\nDo not introduce unrelated elements.",
      "string_b": [
        "375",
        0
      ],
      "delimiter": ""
    },
    "class_type": "StringConcatenate",
    "_meta": {
      "title": "Concatenate"
    }
  },
  "378": {
    "inputs": {
      "prompt": [
        "377",
        0
      ],
      "debug": "enable",
      "url": "http://192.168.0.158:1234",
      "model": "",
      "temperature": 0.8,
      "seed": 1566763150,
      "filter_thinking": true
    },
    "class_type": "LMStudioGenerate",
    "_meta": {
      "title": "LM Studio Generate"
    }
  }
};