import { NextResponse } from "next/server";
import { getAgentState } from "@/lib/agentState";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = getAgentState();
  return NextResponse.json({
    isRunning: state.isRunning,
    currentIteration: state.currentIteration,
    targetIterations: state.targetIterations,
    logs: state.logs
  });
}
