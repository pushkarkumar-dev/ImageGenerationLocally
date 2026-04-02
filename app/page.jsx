"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { COMFYUI_WS_URL } from "@/lib/comfyClient";

const CAPTION_PRESETS = [
  { label: "Simple Description", value: "🖼️ Simple Description" },
  { label: "Detailed Analysis", value: "Describe this media in extreme detail, mentioning lighting, environment, and subjects." },
  { label: "Social Media", value: "Create a concise, punchy caption for social media with suitable hashtags." },
  { label: "Text Extraction", value: "Extract and write out all visible text present in this media." },
  { label: "Art Style", value: "Analyze the exact composition, aesthetics, and art style of this scene." },
];

const PRESET_STYLES = ["Cinematic", "Anime/Manga", "3D Render", "Oil Painting", "Cyberpunk", "Polaroid/Vintage", "Vector Art", "Concept Art"];
const PRESET_LIGHTING = ["Golden Hour", "Neon Lights", "Volumetric/God Rays", "Studio Lighting", "Moody/Dramatic", "Cinematic Lighting", "Bioluminescent"];
const PRESET_CAMERA = ["35mm lens", "Macro Photography", "Drone/Aerial View", "Fish-eye", "GoPro", "Tilt-shift", "Wide Angle"];
const PRESET_VIBE = ["Ethereal/Dreamy", "Gritty/Dark", "Sci-Fi/Futuristic", "Fantasy/Magical", "Minimalist", "Surreal"];

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
  const [clientId, setClientId] = useState("");
  useEffect(() => {
    setClientId(Math.random().toString(36).substring(2, 15));
  }, []);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState("1088x1088");
  const [batchSize, setBatchSize] = useState(1);
  const [activeTab, setActiveTab] = useState("image");
  const [videoUrl, setVideoUrl] = useState(null);
  
  // Node selection per task
  const [serverImage, setServerImage] = useState("http://192.168.0.158:8188");
  const [serverVideo, setServerVideo] = useState("http://192.168.0.158:8188");
  const [serverImage2Text, setServerImage2Text] = useState("http://192.168.0.158:8188");
  const [serverVideo2Text, setServerVideo2Text] = useState("http://192.168.0.158:8188");
  const [activeWsServer, setActiveWsServer] = useState("http://192.168.0.158:8188");

  // Caption tool state
  const [captionFile, setCaptionFile] = useState(null);
  const [captionResult, setCaptionResult] = useState("");
  const [captionPromptImage, setCaptionPromptImage] = useState("");
  const [captionPromptVideo, setCaptionPromptVideo] = useState("");

  // Prompt Builder state
  const [builderTab, setBuilderTab] = useState("image"); // "image" or "video"
  const [builderBasePrompt, setBuilderBasePrompt] = useState("");
  const [builderStyle, setBuilderStyle] = useState("");
  const [builderLighting, setBuilderLighting] = useState("");
  const [builderCamera, setBuilderCamera] = useState("");
  const [builderVibe, setBuilderVibe] = useState("");
  const [builderExtra, setBuilderExtra] = useState("");
  const [builderResult, setBuilderResult] = useState("");
  const [builderLoading, setBuilderLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setProgress(0);
    setImageUrls([]);
    setActiveWsServer(serverImage);
    try {
      const [width, height] = resolution.split("x").map(Number);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width, height, batch_size: batchSize, clientId, serverUrl: serverImage }),
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
    setProgress(0);
    setVideoUrl(null);
    setActiveWsServer(serverVideo);
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, clientId, serverUrl: serverVideo }),
      });
      const data = await response.json();
      if (data.videoUrls) setVideoUrl(data.videoUrls[0]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const generateImageCaption = async () => {
    if (!captionFile) return;
    setLoading(true);
    setProgress(0);
    setCaptionResult("");
    setActiveWsServer(serverImage2Text);
    try {
      const formData = new FormData();
      formData.append("file", captionFile);
      formData.append("clientId", clientId);
      formData.append("serverUrl", serverImage2Text);
      formData.append("customPrompt", captionPromptImage);
      const response = await fetch("/api/caption-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.caption) setCaptionResult(data.caption);
      else if (data.error) setCaptionResult(`Error: ${data.error}`);
    } catch (e) {
      console.error(e);
      setCaptionResult("An error occurred during submission.");
    }
    setLoading(false);
  };

  const generateVideoCaption = async () => {
    if (!captionFile) return;
    setLoading(true);
    setProgress(0);
    setCaptionResult("");
    setActiveWsServer(serverVideo2Text);
    try {
      const formData = new FormData();
      formData.append("file", captionFile);
      formData.append("clientId", clientId);
      formData.append("serverUrl", serverVideo2Text);
      formData.append("customPrompt", captionPromptVideo);
      const response = await fetch("/api/caption-video", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.caption) setCaptionResult(data.caption);
      else if (data.error) setCaptionResult(`Error: ${data.error}`);
    } catch (e) {
      console.error(e);
      setCaptionResult("An error occurred during submission.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.keyCode === 27) setSelectedImage(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // WebSocket for progress
  useEffect(() => {
    if (!clientId) return;
    const wsUrl = activeWsServer.replace(/^http/, "ws");
    const ws = new WebSocket(`${wsUrl}/ws?clientId=${clientId}`);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "progress") {
          const { value, max } = msg.data;
          setProgress(Math.round((value / max) * 100));
        } else if (msg.type === "execution_start") {
          setProgress(0);
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, [clientId, activeWsServer]);

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
            <Link href="/dashboard" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            }}>⚡ Dashboard</Link>
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
          <div style={{ width: "100%", maxWidth: 920 }}>

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
              <div className="tab-bar" style={{ marginBottom: 24, flexWrap: "wrap" }}>
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
                <button
                  className={`tab-btn${activeTab === "image2text" ? " active" : ""}`}
                  onClick={() => setActiveTab("image2text")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                    <ImageIcon /> Image to Text
                  </span>
                </button>
                <button
                  className={`tab-btn${activeTab === "video2text" ? " active" : ""}`}
                  onClick={() => setActiveTab("video2text")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                    <VideoIcon /> Video to Text
                  </span>
                </button>
                <button
                  className={`tab-btn${activeTab === "prompt_builder" ? " active" : ""}`}
                  onClick={() => setActiveTab("prompt_builder")}
                  style={{ marginLeft: "auto", border: "1px solid rgba(124,58,237,0.4)", background: activeTab === "prompt_builder" ? "var(--accent-gradient)" : "rgba(124,58,237,0.1)", color: activeTab === "prompt_builder" ? "#fff" : "#c4b5fd" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                    ✨ Prompt Builder
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

                  <div style={{ marginTop: 4 }}>
                    <label htmlFor="serverImage" className="form-label" style={{ marginBottom: 6 }}>Processing Node</label>
                    <select
                      id="serverImage"
                      value={serverImage}
                      onChange={(e) => setServerImage(e.target.value)}
                      className="form-input"
                    >
                      <option value="http://192.168.0.158:8188">Node 8188 (Primary)</option>
                      <option value="http://192.168.0.158:8189">Node 8189 (Secondary)</option>
                    </select>
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

                  <div style={{ marginTop: 4 }}>
                    <label htmlFor="serverVideo" className="form-label" style={{ marginBottom: 6 }}>Processing Node</label>
                    <select
                      id="serverVideo"
                      value={serverVideo}
                      onChange={(e) => setServerVideo(e.target.value)}
                      className="form-input"
                    >
                      <option value="http://192.168.0.158:8188">Node 8188 (Primary)</option>
                      <option value="http://192.168.0.158:8189">Node 8189 (Secondary)</option>
                    </select>
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

              {/* ── IMAGE TO TEXT ── */}
              {activeTab === "image2text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label htmlFor="caption-image-upload" className="form-label">Upload Image for Description</label>
                    <input
                      type="file"
                      id="caption-image-upload"
                      accept="image/*"
                      onChange={(e) => setCaptionFile(e.target.files[0])}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <label htmlFor="caption-prompt-image" className="form-label">Prompt Instructions</label>
                      <select 
                        title="Load preset prompt"
                        style={{ fontSize: "0.75rem", padding: "2px 8px", width: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#a78bfa", cursor: "pointer" }}
                        onChange={(e) => {
                          if (e.target.value) setCaptionPromptImage(e.target.value);
                          e.target.value = ""; // reset visual selection
                        }}
                      >
                        <option value="" style={{background: "#1e1e2e"}}>📝 Preset Prompts...</option>
                        {CAPTION_PRESETS.map((p, i) => <option key={i} value={p.value} style={{background: "#1e1e2e"}}>{p.label}</option>)}
                      </select>
                    </div>
                    <textarea
                      id="caption-prompt-image"
                      value={captionPromptImage}
                      onChange={(e) => setCaptionPromptImage(e.target.value)}
                      placeholder="Leave blank to use default QwenVL workflow prompt, or enter custom instructions..."
                      rows={2}
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 60, lineHeight: 1.5 }}
                    />
                  </div>

                  <div>
                    <label htmlFor="serverImage2Text" className="form-label" style={{ marginBottom: 6 }}>Processing Node</label>
                    <select
                      id="serverImage2Text"
                      value={serverImage2Text}
                      onChange={(e) => setServerImage2Text(e.target.value)}
                      className="form-input"
                    >
                      <option value="http://192.168.0.158:8188">Node 8188 (Primary)</option>
                      <option value="http://192.168.0.158:8189">Node 8189 (Secondary)</option>
                    </select>
                  </div>

                  <button
                    onClick={generateImageCaption}
                    disabled={loading || !captionFile}
                    className="btn-generate"
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                      {loading ? (
                        <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
                      ) : (
                        <><SparkleIcon /> Describe Image</>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* ── VIDEO TO TEXT ── */}
              {activeTab === "video2text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label htmlFor="caption-video-upload" className="form-label">Upload Video for Description</label>
                    <input
                      type="file"
                      id="caption-video-upload"
                      accept="video/*"
                      onChange={(e) => setCaptionFile(e.target.files[0])}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <label htmlFor="caption-prompt-video" className="form-label">Prompt Instructions</label>
                      <select 
                        title="Load preset prompt"
                        style={{ fontSize: "0.75rem", padding: "2px 8px", width: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#a78bfa", cursor: "pointer" }}
                        onChange={(e) => {
                          if (e.target.value) setCaptionPromptVideo(e.target.value);
                          e.target.value = ""; // reset visual selection
                        }}
                      >
                        <option value="" style={{background: "#1e1e2e"}}>📝 Preset Prompts...</option>
                        {CAPTION_PRESETS.map((p, i) => <option key={i} value={p.value} style={{background: "#1e1e2e"}}>{p.label}</option>)}
                      </select>
                    </div>
                    <textarea
                      id="caption-prompt-video"
                      value={captionPromptVideo}
                      onChange={(e) => setCaptionPromptVideo(e.target.value)}
                      placeholder="Leave blank to use default QwenVL workflow prompt, or enter custom instructions..."
                      rows={2}
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 60, lineHeight: 1.5 }}
                    />
                  </div>

                  <div>
                    <label htmlFor="serverVideo2Text" className="form-label" style={{ marginBottom: 6 }}>Processing Node</label>
                    <select
                      id="serverVideo2Text"
                      value={serverVideo2Text}
                      onChange={(e) => setServerVideo2Text(e.target.value)}
                      className="form-input"
                    >
                      <option value="http://192.168.0.158:8188">Node 8188 (Primary)</option>
                      <option value="http://192.168.0.158:8189">Node 8189 (Secondary)</option>
                    </select>
                  </div>

                  <button
                    onClick={generateVideoCaption}
                    disabled={loading || !captionFile}
                    className="btn-generate"
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                      {loading ? (
                        <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
                      ) : (
                        <><VideoIcon /> Describe Video</>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* ── PROMPT BUILDER ── */}
              {activeTab === "prompt_builder" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="animate-fade-in">
                  
                  {/* Builder Header Options */}
                  <div style={{ display: "flex", gap: 8, background: "rgba(0,0,0,0.2)", padding: 4, borderRadius: 12 }}>
                    <button 
                      onClick={() => setBuilderTab("image")}
                      style={{ flex: 1, padding: "8px 16px", borderRadius: 8, background: builderTab === "image" ? "rgba(255,255,255,0.1)" : "transparent", color: builderTab === "image" ? "#fff" : "#94a3b8", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}
                    >🖼️ Image Prompt</button>
                    <button 
                      onClick={() => setBuilderTab("video")}
                      style={{ flex: 1, padding: "8px 16px", borderRadius: 8, background: builderTab === "video" ? "rgba(255,255,255,0.1)" : "transparent", color: builderTab === "video" ? "#fff" : "#94a3b8", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}
                    >🎞️ Video Prompt</button>
                  </div>

                  <div>
                    <label className="form-label">Core Idea / Subject</label>
                    <textarea
                      value={builderBasePrompt}
                      onChange={(e) => setBuilderBasePrompt(e.target.value)}
                      placeholder={builderTab === "image" ? "A futuristic city at night..." : "A slow pan across a futuristic city at night..."}
                      className="form-input"
                      style={{ minHeight: 60, resize: "vertical" }}
                      rows={2}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="form-label">Art Style</label>
                      <select className="form-select" value={builderStyle} onChange={e => setBuilderStyle(e.target.value)}>
                        <option value="">None</option>
                        {PRESET_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Lighting</label>
                      <select className="form-select" value={builderLighting} onChange={e => setBuilderLighting(e.target.value)}>
                        <option value="">None</option>
                        {PRESET_LIGHTING.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Camera / Lens</label>
                      <select className="form-select" value={builderCamera} onChange={e => setBuilderCamera(e.target.value)}>
                        <option value="">None</option>
                        {PRESET_CAMERA.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Vibe / Atmosphere</label>
                      <select className="form-select" value={builderVibe} onChange={e => setBuilderVibe(e.target.value)}>
                        <option value="">None</option>
                        {PRESET_VIBE.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Extra Keywords (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., highly detailed, 8k resolution, unreal engine 5"
                      value={builderExtra}
                      onChange={e => setBuilderExtra(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn-generate"
                    onClick={async () => {
                      setBuilderLoading(true);
                      setBuilderResult("");
                      try {
                        const res = await fetch("/api/enhance-prompt", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            basePrompt: builderBasePrompt,
                            mediaType: builderTab,
                            modifiers: {
                              style: builderStyle,
                              lighting: builderLighting,
                              camera: builderCamera,
                              vibe: builderVibe,
                              extra: builderExtra
                            }
                          })
                        });
                        const data = await res.json();
                        if (data.enhancedPrompt) {
                          setBuilderResult(data.enhancedPrompt);
                        } else {
                          alert(data.error || "Enhancement failed");
                        }
                      } catch (err) {
                        alert("Error: " + err.message);
                      }
                      setBuilderLoading(false);
                    }}
                    disabled={builderLoading || !builderBasePrompt}
                    style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6)", border: "none" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                      {builderLoading ? (
                        <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Engineering Prompt...</>
                      ) : (
                        <><SparkleIcon /> Enhance with local Qwen3-VL-30B</>
                      )}
                    </span>
                  </button>

                  {builderResult && (
                    <div className="animate-slide-up" style={{ marginTop: 8, background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Final Prompt Payload</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => navigator.clipboard.writeText(builderResult)} style={{ background: "transparent", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: "0.75rem" }}>Copy</button>
                        </div>
                      </label>
                      <textarea
                        value={builderResult}
                        onChange={e => setBuilderResult(e.target.value)}
                        className="form-input"
                        style={{ minHeight: 100, border: "none", background: "rgba(255,255,255,0.02)" }}
                      />
                      <button 
                        onClick={() => {
                          setPrompt(builderResult); // populate global prompt
                          setActiveTab(builderTab); // switch context
                        }}
                        style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 8, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#fff", cursor: "pointer", fontWeight: 600, transition: "background 0.2s" }}
                      >
                        🚀 Send to {builderTab === "image" ? "Text to Image" : "Text to Video"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Loading state with progress ── */}
            {loading && (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }} className="animate-slide-up">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="spinner animate-pulse-glow" style={{ width: 24, height: 24, borderWidth: 2 }} />
                  <p style={{ fontSize: "0.9rem", color: "#f8fafc", fontWeight: 600 }}>
                    {progress > 0 ? `Generating... ${progress}%` : "AI is warming up..."}
                  </p>
                </div>
                
                {/* Progress bar container */}
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "var(--accent-gradient)",
                    transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: 99
                  }} />
                </div>

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

            {/* ── Caption result ── */}
            {captionResult && (activeTab === "image2text" || activeTab === "video2text") && (
              <div style={{ marginTop: 24 }} className="animate-slide-up">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f8fafc" }}>Generated AI Description</h3>
                  <span className="badge">Done</span>
                </div>
                <div style={{
                  padding: "20px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: "14px",
                  color: "#f8fafc", fontSize: "0.95rem", lineHeight: "1.6"
                }}>
                  {captionResult}
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
