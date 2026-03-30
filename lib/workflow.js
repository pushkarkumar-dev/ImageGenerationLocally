
export const baseWorkflow = {
        "9": {
            "inputs": {
                "filename_prefix": "z-image",
                "images": [
                    "57:8",
                    0
                ]
            },
            "class_type": "SaveImage",
            "_meta": {
                "title": "Save Image"
            }
        },
        "58": {
            "inputs": {
                "value": "A beautiful indian baby boy playing with car toys.\n"
            },
            "class_type": "PrimitiveStringMultiline",
            "_meta": {
                "title": "Prompt"
            }
        },
        "57:33": {
            "inputs": {
                "conditioning": [
                    "57:27",
                    0
                ]
            },
            "class_type": "ConditioningZeroOut",
            "_meta": {
                "title": "ConditioningZeroOut"
            }
        },
        "57:8": {
            "inputs": {
                "samples": [
                    "57:3",
                    0
                ],
                "vae": [
                    "57:29",
                    0
                ]
            },
            "class_type": "VAEDecode",
            "_meta": {
                "title": "VAE Decode"
            }
        },
        "57:27": {
            "inputs": {
                "text": [
                    "58",
                    0
                ],
                "clip": [
                    "57:30",
                    0
                ]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {
                "title": "CLIP Text Encode (Prompt)"
            }
        },
        "57:11": {
            "inputs": {
                "shift": 3,
                "model": [
                    "57:28",
                    0
                ]
            },
            "class_type": "ModelSamplingAuraFlow",
            "_meta": {
                "title": "ModelSamplingAuraFlow"
            }
        },
        "57:29": {
            "inputs": {
                "vae_name": "ultrafluxv1.safetensors"
            },
            "class_type": "VAELoader",
            "_meta": {
                "title": "Load VAE"
            }
        },
        "57:28": {
            "inputs": {
                "unet_name": "z_image_turbo_bf16.safetensors",
                "weight_dtype": "default"
            },
            "class_type": "UNETLoader",
            "_meta": {
                "title": "Load Diffusion Model"
            }
        },
        "57:3": {
            "inputs": {
                "seed": 501928037779408,
                "steps": 9,
                "cfg": 1,
                "sampler_name": "res_multistep",
                "scheduler": "simple",
                "denoise": 1,
                "model": [
                    "57:11",
                    0
                ],
                "positive": [
                    "57:27",
                    0
                ],
                "negative": [
                    "57:33",
                    0
                ],
                "latent_image": [
                    "57:13",
                    0
                ]
            },
            "class_type": "KSampler",
            "_meta": {
                "title": "KSampler"
            }
        },
        "57:13": {
            "inputs": {
                // You can't add UI elements like dropdowns or sliders directly in this file. 
                // UI elements are defined in the Python code of the ComfyUI nodes on the server.
                // However, you can manually change the values below for width, height, and batch_size.

                // Pre-configured resolution options:
                // 1k: "width": 1024, "height": 1024
                // 2k: "width": 2048, "height": 2048
                // 4k: "width": 4096, "height": 4096
                // Square (default): "width": 1088, "height": 1088
                "width": 1088,
                "height": 1088,

                // You can set the batch_size to any value from 1 to 8.
                "batch_size": 1
            },
            "class_type": "EmptySD3LatentImage",
            "_meta": {
                "title": "EmptySD3LatentImage"
            }
        },
        "57:30": {
            "inputs": {
                "clip_name": "qwen_3_4b.safetensors",
                "type": "lumina2",
                "device": "default"
            },
            "class_type": "CLIPLoader",
            "_meta": {
                "title": "Load CLIP"
            }
        }
    };