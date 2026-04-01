import { NextResponse } from "next/server";
import { COMFYUI_URL } from "@/lib/comfyClient";

export async function GET() {
  try {
    const [statsRes, queueRes] = await Promise.all([
      fetch(`${COMFYUI_URL}/system_stats`, { cache: "no-store" }),
      fetch(`${COMFYUI_URL}/queue`,         { cache: "no-store" }),
    ]);

    const stats = await statsRes.json();
    const queue = await queueRes.json();

    return NextResponse.json({
      system:  stats.system  ?? {},
      devices: stats.devices ?? [],
      queue: {
        running: queue.queue_running?.length ?? 0,
        pending: queue.queue_pending?.length ?? 0,
      },
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("[gpu-stats]", err.message);
    return NextResponse.json(
      { error: "Cannot reach ComfyUI", message: err.message },
      { status: 503 }
    );
  }
}
