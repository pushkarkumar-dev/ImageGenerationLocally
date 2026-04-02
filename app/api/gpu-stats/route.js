import { NextResponse } from "next/server";
import { COMFYUI_URL } from "@/lib/comfyClient";

const COMFY_URLS = [
  COMFYUI_URL,
  "http://192.168.0.158:8189"
];

async function fetchInstanceStats(url) {
  try {
    const [statsRes, queueRes] = await Promise.all([
      fetch(`${url}/system_stats`, { cache: "no-store" }),
      fetch(`${url}/queue`,        { cache: "no-store" }),
    ]);

    const stats = await statsRes.json();
    const queue = await queueRes.json();

    return {
      system: stats.system ?? {},
      devices: stats.devices ?? [],
      queue: {
        running: queue.queue_running?.length ?? 0,
        pending: queue.queue_pending?.length ?? 0,
      },
      url,
    };
  } catch (err) {
    console.error(`[gpu-stats] Cannot reach ${url}:`, err.message);
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(COMFY_URLS.map(fetchInstanceStats));
  const active = results.filter(Boolean);

  if (active.length === 0) {
    return NextResponse.json(
      { error: "Cannot reach any ComfyUI instances", message: "All instances offline" },
      { status: 503 }
    );
  }

  // Assume system RAM info from the first active instance
  const system = active[0].system;
  
  // Flatten devices from all active instances and tag with source
  const devices = active.flatMap(inst => 
    inst.devices.map(d => ({ ...d, source: inst.url }))
  );

  // Sum up all queues
  const queue = active.reduce((acc, inst) => {
    acc.running += inst.queue.running;
    acc.pending += inst.queue.pending;
    return acc;
  }, { running: 0, pending: 0 });

  return NextResponse.json({
    system,
    devices,
    queue,
    instances: active.map(inst => ({ url: inst.url, queue: inst.queue })),
    timestamp: Date.now(),
  });
}
