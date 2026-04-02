// lib/agentState.js

// Leverage globalThis to persist state across Next.js API hot-reloads during dev
const globalState = globalThis;

if (!globalState.aiAgentState) {
  globalState.aiAgentState = {
    isRunning: false,
    theme: "",
    targetIterations: 0,
    currentIteration: 0,
    mediaType: "image",
    width: 1088,
    height: 1088,
    logs: [],
    shouldStop: false,
    pendingJobs: [],
    isSweeping: false,
  };
}

export const getAgentState = () => globalState.aiAgentState;

export const appendLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  globalState.aiAgentState.logs.push(`[${timestamp}] ${message}`);
  // Keep last 200 logs to prevent memory overflow
  if (globalState.aiAgentState.logs.length > 200) {
    globalState.aiAgentState.logs.shift();
  }
};

export const resetAgentState = (theme, target, mediaType, width, height) => {
  globalState.aiAgentState = {
    isRunning: true,
    theme: theme,
    targetIterations: target,
    currentIteration: 0,
    mediaType: mediaType,
    width: width || 1088, 
    height: height || 1088,
    logs: [],
    shouldStop: false,
    pendingJobs: globalState.aiAgentState.pendingJobs || [],
  };
};
