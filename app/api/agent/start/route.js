import { NextResponse } from "next/server";
import { getAgentState, resetAgentState, appendLog } from "@/lib/agentState";
import { applyParams } from "@/lib/workflowEngine";
import { applyParamsToVideoWorkflow } from "@/lib/videoWorkflowEngine";
import { submitWorkflow, getHistory } from "@/lib/comfyClient";
import { query } from "@/lib/db";

// The decoupled Database Sweeper. It persistently checks ComfyUI for completion of jobs.
const runSyncSweeper = async () => {
    const state = getAgentState();
    if (state.isSweeping) return;
    state.isSweeping = true;

    try {
        while (state.pendingJobs.length > 0 || state.isRunning) {
            for (let i = state.pendingJobs.length - 1; i >= 0; i--) {
                const job = state.pendingJobs[i];
                try {
                    const history = await getHistory(job.promptId, job.serverUrl);
                    if (history && history[job.promptId]) {
                        // The job is officially processed by ComfyUI!
                        const outputs = history[job.promptId].outputs || {};
                        const mediaUrls = [];
                        
                        if (job.mediaType === "image") {
                            for (const key in outputs) {
                                if (outputs[key].images) {
                                    for (const img of outputs[key].images) {
                                        mediaUrls.push(`${job.serverUrl}/view?filename=${img.filename}&subfolder=${img.subfolder}&type=${img.type}`);
                                    }
                                }
                            }
                            for (const url of mediaUrls) {
                                await query("INSERT INTO generated_images (prompt, image_url, resolution) VALUES (?, ?, ?)", [job.promptText, url, null]);
                            }
                        } else {
                            for (const key in outputs) {
                                if (outputs[key].gifs) {
                                    for (const vid of outputs[key].gifs) {
                                        mediaUrls.push(`${job.serverUrl}/view?filename=${vid.filename}&subfolder=${vid.subfolder}&type=${vid.type}`);
                                    }
                                }
                            }
                            for (const url of mediaUrls) {
                                await query("INSERT INTO generated_videos (prompt, video_url) VALUES (?, ?)", [job.promptText, url]);
                            }
                        }

                        // Remove from bucket and log the win to the user's terminal
                        state.pendingJobs.splice(i, 1);
                        appendLog(`[Sweeper] Successfully lodged ${job.mediaType} in Database! (${state.pendingJobs.length} running)`);
                    }
                } catch (e) {
                    // Suppress network errors from ComfyUI and retry naturally next cycle
                }
            }
            await new Promise(r => setTimeout(r, 6000)); // Poll safely
        }
    } finally {
        state.isSweeping = false;
        appendLog(`[Sweeper] GPUs are empty. Sweeper deactivated.`);
    }
};

// A non-awaited background agent loop
const runAgentLoop = async () => {
    const state = getAgentState();
    
    appendLog(`[AGENT START] Theme: ${state.theme}, Target: ${state.targetIterations}, Base Format: ${state.mediaType}`);

    while(state.isRunning && state.currentIteration < state.targetIterations && !state.shouldStop) {
        state.currentIteration++;
        appendLog(`--- Iteration ${state.currentIteration}/${state.targetIterations} ---`);
        
        // 1. Brainstorm
        appendLog(`[Thinking] Consulting local Qwen3-VL-30b model...`);
        let engineeredPrompt = state.theme; // fallback
        
        try {
            const systemPrompt = `You are an imaginative AI director for a text-to-${state.mediaType} synthesis model. Develop an extremely descriptive, highly creative single scenario prompt based entirely around the following theme. Output ONLY the strict prompt string, separated by commas, no introductory text.`;
            const lmResponse = await fetch("http://192.168.0.201:1234/v1/chat/completions", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    model: "qwen/qwen3-vl-30b",
                    messages: [
                        {role: "system", content: systemPrompt},
                        {role: "user", content: `Theme to expand upon: ${state.theme}\n\nGenerate your brilliant scene:`}
                    ],
                    temperature: 0.9,
                    max_tokens: 150,
                })
            });
            
            if (lmResponse.ok) {
                const lmData = await lmResponse.json();
                engineeredPrompt = lmData.choices[0].message.content.trim();
                appendLog(`[Eureka!] Crafted prompt: "${engineeredPrompt.substring(0, 75)}..."`);
            } else {
                appendLog(`[WARN] LMStudio API failed, falling back to base theme.`);
            }
        } catch(err) {
            appendLog(`[ERROR] LMStudio unreachable: ${err.message}. Using base theme.`);
        }

        // Check early termination
        if (state.shouldStop) break;

        // 2. Decide Target GPU Load Balanced (Alternating algorithm)
        const targetServer = state.currentIteration % 2 === 0 ? "http://192.168.0.158:8189" : "http://192.168.0.158:8188";
        appendLog(`[Dispatch] Targeting multi-GPU instance ${targetServer}`);

        // 3. Assemble workflow payload with a random seed
        try {
            const seed = Math.floor(Math.random() * 1000000000);
            const workflow = state.mediaType === "video" 
                ? applyParamsToVideoWorkflow({ prompt: engineeredPrompt, seed: seed, width: state.width, height: state.height }) 
                : applyParams({ prompt: engineeredPrompt, seed: seed, width: state.width, height: state.height });
            
            // 4. Submit
            const submitResponse = await submitWorkflow(workflow, "nano-banana-agent", targetServer);
            if (submitResponse.error) {
                appendLog(`[ERROR] Workflow submission failed: ${submitResponse.error}`);
            } else {
                appendLog(`[Success] Job ${submitResponse.prompt_id} queued on ${targetServer}`);
                
                // 5. Transfer to Sweeper
                state.pendingJobs.push({
                    promptId: submitResponse.prompt_id,
                    serverUrl: targetServer,
                    promptText: engineeredPrompt,
                    mediaType: state.mediaType
                });

                // Spin up sweeper if it wasn't alive already
                runSyncSweeper().catch(e => console.error("Sweeper crash", e));
            }
        } catch (e) {
            appendLog(`[ERROR] Workflow build/submit crashed: ${e.message}`);
        }

        // Rest cycle to prevent swamping the LAN
        appendLog(`[Sleeping] Cooling down for 2 seconds...`);
        await new Promise(r => setTimeout(r, 2000));
    }

    if (state.shouldStop) {
        appendLog(`[ABORTED] Agent halted by operator.`);
    } else {
        appendLog(`[COMPLETED] Agent has successfully finished its task quota!`);
    }
    state.isRunning = false;
};

export async function POST(req) {
    try {
        const { theme, iterations, mediaType, width, height } = await req.json();
        const state = getAgentState();
        
        if (state.isRunning) {
            return NextResponse.json({ error: "Agent is currently busy with another task suite!" }, {status: 400});
        }

        resetAgentState(theme, iterations, mediaType || "image", width, height);
        
        // Kick off async loop explicitly detached
        runAgentLoop().catch(e => console.error("Agent crashed:", e));

        return NextResponse.json({ success: true, message: "Agent loop started successfully in background." });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
