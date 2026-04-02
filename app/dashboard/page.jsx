"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ── Icons ────────────────────────────────────────────────────────────────────
const GpuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6V4"/><path d="M10 6V4"/><path d="M14 6V4"/><path d="M18 6V4"/><path d="M6 18v2"/><path d="M10 18v2"/><path d="M14 18v2"/><path d="M18 18v2"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const GalleryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? "spin 0.9s linear infinite" : "none" }}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(bytes) {
  if (!bytes) return "0 MB";
  const gb = bytes / 1024 / 1024 / 1024;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}

function pct(used, total) {
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

function vramColor(p) {
  if (p < 50) return "#10b981";
  if (p < 75) return "#f59e0b";
  return "#ef4444";
}

// ── Bar ───────────────────────────────────────────────────────────────────────
function Bar({ value, max, color, label, sublabel }) {
  const p = pct(value, max);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ fontSize: "0.72rem", color: "#f8fafc", fontWeight: 700 }}>{sublabel}</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: `${p}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 10px ${color}55`,
        }} />
      </div>
    </div>
  );
}

// ── GPU Card ─────────────────────────────────────────────────────────────────
function GpuCard({ device, index }) {
  const vramUsed   = (device.vram_total ?? 0) - (device.vram_free ?? 0);
  const torchUsed  = (device.torch_vram_total ?? 0) - (device.torch_vram_free ?? 0);
  const vramPct    = pct(vramUsed, device.vram_total);

  const isActive   = vramPct > 5;
  const dotColor   = isActive ? "#10b981" : "#6b7280";

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${isActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 18,
      padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 18,
      transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      boxShadow: isActive ? "0 0 30px rgba(124,58,237,0.1)" : "none",
    }}>
      {/* GPU header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: dotColor,
              boxShadow: isActive ? `0 0 8px ${dotColor}` : "none",
              animation: isActive ? "pulse-dot 2s ease-in-out infinite" : "none",
            }} />
            <span style={{ fontSize: "0.65rem", color: dotColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {isActive ? "Active" : "Idle"}
            </span>
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc", lineHeight: 1.3 }}>
            {device.name ?? `GPU ${index}`}
          </p>
          <p style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: 2 }}>
            Device {device.index ?? index} · {device.type?.toUpperCase() ?? "CUDA"}
            {device.source && ` · Port ${new URL(device.source).port || "80"}`}
          </p>
        </div>
        <div style={{
          padding: "8px 14px", borderRadius: 99,
          background: `${vramColor(vramPct)}18`,
          border: `1px solid ${vramColor(vramPct)}40`,
        }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: vramColor(vramPct), lineHeight: 1 }}>
            {vramPct}%
          </span>
          <p style={{ fontSize: "0.58rem", color: "#6b7280", textAlign: "center", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>VRAM</p>
        </div>
      </div>

      {/* VRAM bar */}
      <Bar
        value={vramUsed}
        max={device.vram_total}
        color={vramColor(vramPct)}
        label="VRAM Usage"
        sublabel={`${fmt(vramUsed)} / ${fmt(device.vram_total)}`}
      />

      {/* Torch VRAM if available */}
      {device.torch_vram_total > 0 && (
        <Bar
          value={torchUsed}
          max={device.torch_vram_total}
          color="#7c3aed"
          label="PyTorch VRAM"
          sublabel={`${fmt(torchUsed)} / ${fmt(device.torch_vram_total)}`}
        />
      )}

      {/* Free VRAM callout */}
      <div style={{
        padding: "10px 14px", borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>Free VRAM</span>
        <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>{fmt(device.vram_free)}</span>
      </div>
    </div>
  );
}

function SystemCard({ system, instances }) {
  const ramUsed = (system.ram_total ?? 0) - (system.ram_free ?? 0);
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        System
      </p>

      <Bar
        value={ramUsed}
        max={system.ram_total}
        color="#06b6d4"
        label="Shared RAM"
        sublabel={`${fmt(ramUsed)} / ${fmt(system.ram_total)}`}
      />

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />

      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        ComfyUI Instances
      </p>

      {/* Per-instance queues */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {instances?.map((inst, i) => {
          const port = new URL(inst.url).port || "80";
          const isActive = inst.queue.running > 0;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 10,
              background: isActive ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: isActive ? "#a78bfa" : "#e2e8f0" }}>
                Node {port}
              </span>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.85rem", color: isActive ? "#d8b4fe" : "#94a3b8", fontWeight: 700 }}>{inst.queue.running}</span>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>run</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 700 }}>{inst.queue.pending}</span>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>wait</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {system.os && (
        <p style={{ fontSize: "0.7rem", color: "#374151" }}>OS: {system.os}</p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData]         = useState(null);
  const [error, setError]       = useState(null);
  const [lastUpdate, setLast]   = useState(null);
  const [spinning, setSpinning] = useState(false);
  const intervalRef             = useRef(null);
  const POLL_MS = 3000;

  const fetchStats = useCallback(async () => {
    setSpinning(true);
    try {
      const res  = await fetch("/api/gpu-stats");
      const json = await res.json();
      if (json.error) { setError(json.message); setData(null); }
      else             { setData(json); setError(null); }
      setLast(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setTimeout(() => setSpinning(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(fetchStats, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchStats]);

  const navLink = (href, icon, label) => (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 10,
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
      color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
    }}>{icon} {label}</Link>
  );

  return (
    <>
      <div className="bg-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ padding: "24px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg,#7c3aed,#ec4899)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(124,58,237,0.5)", fontSize: "1.1rem",
            }}>✦</div>
            <div>
              <h1 style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#f8fafc", lineHeight: 1.2 }}>Nano Banana</h1>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>Local AI Studio</p>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {navLink("/", <HomeIcon />, "Studio")}
            {navLink("/gallery", <GalleryIcon />, "Gallery")}
          </nav>
        </header>

        <main style={{ flex: 1, padding: "32px 24px 48px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {/* Page title */}
          <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <GpuIcon />
                <h2 className="gradient-text" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  GPU Dashboard
                </h2>
              </div>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Live stats from your Razer Blade 18 — polling every {POLL_MS / 1000}s
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {lastUpdate && (
                <span style={{ fontSize: "0.7rem", color: "#4b5563" }}>
                  Updated {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchStats}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 10,
                  background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                  color: "#a78bfa", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
                }}
              >
                <RefreshIcon spinning={spinning} /> Refresh
              </button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div style={{
              padding: "20px 24px", borderRadius: 14, marginBottom: 24,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <div>
                <p style={{ color: "#fca5a5", fontWeight: 700, marginBottom: 2 }}>Cannot reach ComfyUI</p>
                <p style={{ color: "#6b7280", fontSize: "0.8rem" }}>{error}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {!data && !error && (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <div className="spinner animate-pulse-glow" />
            </div>
          )}

          {/* Dashboard grid */}
          {data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* System + queue overview */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}>
                <SystemCard system={data.system} instances={data.instances} />

                {/* Quick stats */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18, padding: "22px 24px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16,
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    GPU Fleet
                  </p>
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <p style={{ fontSize: "3rem", fontWeight: 800, color: "#f8fafc", lineHeight: 1 }}>
                      {data.devices.length}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }}>
                      {data.devices.length === 3 ? "All 3 GPUs online 🚀" : "GPU(s) detected"}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {data.devices.map((d, i) => {
                      const used = (d.vram_total ?? 0) - (d.vram_free ?? 0);
                      const p    = pct(used, d.vram_total);
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.65rem", color: "#6b7280", width: 16 }}>G{i}</span>
                          <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
                            <div style={{
                              height: "100%", borderRadius: 99,
                              width: `${p}%`,
                              background: vramColor(p),
                              transition: "width 0.6s ease",
                            }} />
                          </div>
                          <span style={{ fontSize: "0.65rem", color: vramColor(p), fontWeight: 700, width: 32, textAlign: "right" }}>{p}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* GPU Cards */}
              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                  Individual GPU Stats
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 16,
                }}>
                  {data.devices.map((device, i) => (
                    <GpuCard key={i} device={device} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
