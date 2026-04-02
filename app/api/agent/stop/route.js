import { NextResponse } from "next/server";
import { getAgentState, appendLog } from "@/lib/agentState";

export async function POST() {
  const state = getAgentState();
  if (state.isRunning) {
    state.shouldStop = true;
    appendLog("[SYSTEM] Stop signal received. Agent shutting down...");
    return NextResponse.json({ success: true, message: "Stop signal sent" });
  }
  return NextResponse.json({ success: false, message: "Agent is not currently running" });
}
