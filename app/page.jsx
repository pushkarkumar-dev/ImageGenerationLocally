"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// SVG Icons
const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState("1088x1088");
  const [batchSize, setBatchSize] = useState(1);
  const [activeTab, setActiveTab] = useState("image");
  const [videoUrl, setVideoUrl] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setImageUrls([]);
    try {
      const [width, height] = resolution.split("x").map(Number);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width, height, batch_size: batchSize }),
      });
      const data = await response.json();
      if (data.imageUrls) setImageUrls(data.imageUrls);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.videoUrls) setVideoUrl(data.videoUrls[0]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.keyCode === 27) setSelectedImage(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Compute grid class based on image count
  const gridClass =
    imageUrls.length === 1 ? "cols-1" :
    imageUrls.length <= 4 ? "cols-2" :
    "cols-3";

  const sliderPercent = ((batchSize - 1) / 7) * 100;

  return (
    <>
      {/* Animated background */}
      <div className="bg-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <header style={{ padding: "28px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Logo mark */}
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
              fontSize: "1.1rem"
            }}>
              ✦
            </div>
            <div>
              <h1 style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#f8fafc", lineHeight: 1.2 }}>
                Nano Banana
              </h1>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>Local AI Studio</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="badge">
              <span className="badge-dot" />
              Online
            </div>
            <Link href="/gallery" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            }}>🖼 Gallery</Link>
            <Link href="/trash" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            }}>🗑 Trash</Link>
          </div>
        </header>

        {/* ── Main content ── */}
        <main style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}>
          <div style={{ width: "100%", maxWidth: 720 }}>

            {/* Hero headline */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 10 }}>
                Locally Hosted · Zero Cloud
              </p>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 12 }} className="gradient-text">
                Generate Art Instantly
              </h2>
              <p style={{ color: "#6b7280", fontSize: "0.9375rem", fontWeight: 400, lineHeight: 1.6 }}>
                Transform words into stunning visuals using<br />your local AI pipeline. Fast. Private. Yours.
              </p>
            </div>

            {/* Glass card */}
            <div className="glass-card animate-slide-up" style={{ padding: 28 }}>

              {/* Tab bar */}
              <div className="tab-bar" style={{ marginBottom: 24 }}>
                <button
                  className={`tab-btn${activeTab === "image" ? " active" : ""}`}
                  onClick={() => setActiveTab("image")}
                  id="tab-image"
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                    <ImageIcon /> Text to Image
                  </span>
                </button>
                <button
                  className={`tab-btn${activeTab === "video" ? " active" : ""}`}
                  onClick={() => setActiveTab("video")}
                  id="tab-video"
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                    <VideoIcon /> Text to Video
                  </span>
                </button>
              </div>

              {/* ── IMAGE TAB ── */}
              {activeTab === "image" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Prompt */}
                  <div>
                    <label htmlFor="prompt-image" className="form-label">Describe your image</label>
                    <textarea
                      id="prompt-image"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A cinematic portrait of an astronaut floating in a nebula, dramatic lighting, 8k..."
                      rows={3}
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt && !loading) generateImage();
                      }}
                    />
                    <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: 6 }}>Tip: Press ⌘ + Enter to generate</p>
                  </div>

                  {/* Resolution */}
                  <div>
                    <label htmlFor="resolution" className="form-label">Resolution</label>
                    <select
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="form-select"
                    >
                      <option value="1088x1088">1088 × 1088 · Square</option>
                      <option value="1024x576">1024 × 576 · 16:9 (HD)</option>
                      <option value="576x1024">576 × 1024 · 9:16 (Story)</option>
                      <option value="2048x1152">2048 × 1152 · 16:9 (2K)</option>
                      <option value="1152x2048">1152 × 2048 · 9:16 (2K)</option>
                      <option value="4096x2304">4096 × 2304 · 16:9 (4K)</option>
                      <option value="2304x4096">2304 × 4096 · 9:16 (4K)</option>
                    </select>
                  </div>

                  {/* Batch size */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <label htmlFor="batchSize" className="form-label" style={{ marginBottom: 0 }}>Number of images</label>
                      <span className="count-chip">{batchSize}</span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{
                        position: "absolute", top: "50%", left: 0, right: 0, height: 6,
                        background: "rgba(255,255,255,0.08)", borderRadius: 99, transform: "translateY(-50%)"
                      }} />
                      <div style={{
                        position: "absolute", top: "50%", left: 0, height: 6,
                        width: `${sliderPercent}%`,
                        background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                        borderRadius: 99, transform: "translateY(-50%)",
                        pointerEvents: "none",
                        transition: "width 0.15s ease",
                      }} />
                      <input
                        type="range"
                        id="batchSize"
                        min="1" max="8"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        className="form-range"
                        style={{ position: "relative", zIndex: 1 }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <span key={n} style={{ fontSize: "0.7rem", color: n <= batchSize ? "#7c3aed" : "#374151", fontWeight: 600 }}>{n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={generateImage}
                    disabled={loading || !prompt}
                    className="btn-generate"
                    id="btn-generate-image"
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                      {loading ? (
                        <>
                          <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                          Generating…
                        </>
                      ) : (
                        <>
                          <SparkleIcon /> Generate Image
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* ── VIDEO TAB ── */}
              {activeTab === "video" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label htmlFor="prompt-video" className="form-label">Describe your video</label>
                    <textarea
                      id="prompt-video"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A slow-motion wave crashing on a sunset beach, golden hour, cinematic..."
                      rows={3}
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Info banner */}
                  <div style={{
                    padding: "12px 16px",
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 10,
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: "1rem" }}>⚡</span>
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5 }}>
                      Video generation takes ~60–120s. Be descriptive for best results — include motion, lighting, and mood cues.
                    </p>
                  </div>

                  <button
                    onClick={generateVideo}
                    disabled={loading || !prompt}
                    className="btn-generate"
                    id="btn-generate-video"
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                      {loading ? (
                        <>
                          <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                          Generating…
                        </>
                      ) : (
                        <>
                          <VideoIcon /> Generate Video
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ── Loading shimmer ── */}
            {loading && (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <div className="spinner animate-pulse-glow" />
                <p style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
                  AI is weaving pixels…
                </p>
                {activeTab === "image" && batchSize > 1 && (
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(batchSize, 2)}, 1fr)`, gap: 10, width: "100%", marginTop: 8 }}>
                    {Array.from({ length: batchSize }).map((_, i) => (
                      <div key={i} className="shimmer" style={{ aspectRatio: "1", borderRadius: 14, background: "rgba(255,255,255,0.03)" }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Image results ── */}
            {imageUrls.length > 0 && activeTab === "image" && (
              <div style={{ marginTop: 24 }} className="animate-slide-up">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f8fafc" }}>Generated Images</h3>
                  <span className="badge">{imageUrls.length} result{imageUrls.length > 1 ? "s" : ""}</span>
                </div>
                <div className={`image-grid ${gridClass}`}>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="image-card" onClick={() => setSelectedImage(url)} id={`img-result-${index}`}>
                      <img src={url} alt={`Generated image ${index + 1}`} />
                      <div className="image-overlay">
                        <div className="overlay-icon">
                          <ExpandIcon />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Video result ── */}
            {videoUrl && activeTab === "video" && (
              <div style={{ marginTop: 24 }} className="animate-slide-up">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f8fafc" }}>Generated Video</h3>
                  <span className="badge">Ready</span>
                </div>
                <div className="video-wrapper">
                  <video controls src={videoUrl} />
                </div>
              </div>
            )}

          </div>
        </main>

        {/* ── Footer ── */}
        <footer style={{
          padding: "16px 32px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}>
          <p style={{ fontSize: "0.75rem", color: "#374151", fontWeight: 500 }}>
            Built by <span style={{ color: "#7c3aed", fontWeight: 700 }}>Pushkar</span>
          </p>
          <p style={{ fontSize: "0.75rem", color: "#374151" }}>
            Powered by ComfyUI · Local inference
          </p>
        </footer>
      </div>

      {/* ── Image modal ── */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
          id="modal-overlay"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged image" />
            <button className="modal-close" onClick={() => setSelectedImage(null)} id="modal-close" aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
