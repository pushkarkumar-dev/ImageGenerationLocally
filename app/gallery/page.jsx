"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Icons ────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ExpandIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ type }) {
  return (
    <div style={{
      textAlign: "center", padding: "80px 20px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 72, height: 72,
        background: "rgba(124,58,237,0.1)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem",
      }}>
        {type === "image" ? "🖼️" : "🎬"}
      </div>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", maxWidth: 300, lineHeight: 1.6 }}>
        No {type === "image" ? "images" : "videos"} generated yet.<br />
        Head back to the studio and create some!
      </p>
      <Link href="/" style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "10px 20px",
        background: "linear-gradient(135deg,#7c3aed,#ec4899)",
        borderRadius: 10, color: "#fff", fontSize: "0.85rem",
        fontWeight: 600, textDecoration: "none",
      }}>
        <HomeIcon /> Go to Studio
      </Link>
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div style={{
        background: "linear-gradient(145deg,rgba(20,16,40,0.98),rgba(15,12,32,0.98))",
        border: "1px solid rgba(124,58,237,0.25)",
        borderRadius: 16, padding: "28px 32px",
        maxWidth: 380, width: "90%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        <p style={{ color: "#f8fafc", fontWeight: 600, marginBottom: 8 }}>Are you sure?</p>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Image Card ───────────────────────────────────────────────────────────────
function ImageCard({ item, onDelete, onExpand }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await fetch(`/api/gallery/images/${item.id}`, { method: "DELETE" });
      onDelete(item.id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        position: "relative", borderRadius: 14,
        overflow: "hidden", cursor: "pointer",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.3)",
        opacity: deleting ? 0.4 : 1,
        pointerEvents: deleting ? "none" : "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onExpand(item)}
      id={`img-card-${item.id}`}
    >
      <img
        src={item.image_url}
        alt={item.prompt}
        style={{ width: "100%", display: "block", aspectRatio: "1", objectFit: "cover" }}
      />
      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s ease",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12,
      }}>
        <p style={{
          fontSize: "0.7rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          marginBottom: 8,
        }}>{item.prompt}</p>
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>{formatDate(item.created_at)}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={e => { e.stopPropagation(); onExpand(item); }}
              title="Expand"
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(255,255,255,0.15)", border: "none",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            ><ExpandIcon /></button>
            <button
              onClick={handleDelete}
              title="Move to trash"
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(239,68,68,0.25)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            ><TrashIcon /></button>
          </div>
        </div>
      </div>
      {/* Resolution badge */}
      {item.resolution && (
        <div style={{
          position: "absolute", top: 8, left: 8,
          padding: "3px 8px", borderRadius: 6,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          fontSize: "0.6rem", color: "rgba(255,255,255,0.7)", fontWeight: 600,
          letterSpacing: "0.04em",
        }}>{item.resolution}</div>
      )}
    </div>
  );
}

// ── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ item, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/gallery/videos/${item.id}`, { method: "DELETE" });
      onDelete(item.id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: 14, overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.3)",
        opacity: deleting ? 0.4 : 1,
        pointerEvents: deleting ? "none" : "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id={`vid-card-${item.id}`}
    >
      <video
        src={item.video_url}
        controls
        style={{ width: "100%", display: "block", maxHeight: 260, objectFit: "cover", background: "#000" }}
      />
      <div style={{ padding: "12px 14px" }}>
        <p style={{
          fontSize: "0.75rem", color: "#cbd5e1", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          marginBottom: 8,
        }}>{item.prompt}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.65rem", color: "#4b5563" }}>{formatDate(item.created_at)}</span>
          <button
            onClick={handleDelete}
            title="Move to trash"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 8,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600,
            }}
          ><TrashIcon /> Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNavigate }) {
  const item = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft"  && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, index, hasPrev, hasNext]);

  const navBtnStyle = (enabled) => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: 48, height: 48, borderRadius: "50%",
    background: enabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    color: enabled ? "#fff" : "rgba(255,255,255,0.2)",
    cursor: enabled ? "pointer" : "default",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s, transform 0.15s",
    zIndex: 10,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>

      {/* Prev button */}
      <button
        onClick={e => { e.stopPropagation(); if (hasPrev) onNavigate(index - 1); }}
        style={{ ...navBtnStyle(hasPrev), left: 16 }}
        aria-label="Previous image"
      ><ChevronLeftIcon /></button>

      {/* Image + caption */}
      <div style={{
        position: "relative", maxWidth: "calc(100vw - 160px)", maxHeight: "90vh",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      }} onClick={e => e.stopPropagation()}>
        <img
          key={item.id}
          src={item.image_url}
          alt={item.prompt}
          style={{
            maxWidth: "100%", maxHeight: "78vh",
            borderRadius: 16, objectFit: "contain",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            animation: "fadeIn 0.18s ease",
          }}
        />
        <p style={{
          fontSize: "0.8rem", color: "rgba(255,255,255,0.55)",
          textAlign: "center", lineHeight: 1.5, maxWidth: 600,
        }}>{item.prompt}</p>

        {/* Counter */}
        <span style={{
          position: "absolute", bottom: -36,
          fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: 600,
          letterSpacing: "0.08em",
        }}>{index + 1} / {images.length}</span>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: -14, right: -14,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        ><CloseIcon /></button>
      </div>

      {/* Next button */}
      <button
        onClick={e => { e.stopPropagation(); if (hasNext) onNavigate(index + 1); }}
        style={{ ...navBtnStyle(hasNext), right: 16 }}
        aria-label="Next image"
      ><ChevronRightIcon /></button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("image");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgTotal, setImgTotal] = useState(0);
  const [vidTotal, setVidTotal] = useState(0);
  const [imgPage, setImgPage] = useState(1);
  const [vidPage, setVidPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const LIMIT = 24;

  const fetchImages = useCallback(async (page = 1, append = false) => {
    try {
      const res = await fetch(`/api/gallery/images?page=${page}&limit=${LIMIT}`);
      const data = await res.json();
      const items = data.items || [];
      setImages(prev => append ? [...prev, ...items] : items);
      setImgTotal(data.total || 0);
    } catch (err) {
      console.error("[fetchImages]", err);
    }
  }, []);

  const fetchVideos = useCallback(async (page = 1, append = false) => {
    try {
      const res = await fetch(`/api/gallery/videos?page=${page}&limit=${LIMIT}`);
      const data = await res.json();
      const items = data.items || [];
      setVideos(prev => append ? [...prev, ...items] : items);
      setVidTotal(data.total || 0);
    } catch (err) {
      console.error("[fetchVideos]", err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchImages(1), fetchVideos(1)]).finally(() => setLoading(false));
  }, [fetchImages, fetchVideos]);

  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(i => i.id !== id));
    setImgTotal(t => t - 1);
  };
  const handleDeleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setVidTotal(t => t - 1);
  };

  const loadMoreImages = async () => {
    const next = imgPage + 1;
    setImgPage(next);
    await fetchImages(next, true);
  };
  const loadMoreVideos = async () => {
    const next = vidPage + 1;
    setVidPage(next);
    await fetchVideos(next, true);
  };

  const hasMoreImages = images.length < imgTotal;
  const hasMoreVideos = videos.length < vidTotal;

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
              <h1 style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#f8fafc", lineHeight: 1.2 }}>
                Nano Banana
              </h1>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>Local AI Studio</p>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
              transition: "all 0.2s",
            }}>
              <HomeIcon /> Studio
            </Link>
            <Link href="/trash" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            }}>
              🗑 Trash
            </Link>
          </nav>
        </header>

        <main style={{ flex: 1, padding: "32px 24px 48px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h2 className="gradient-text" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
              Your Gallery
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              All AI-generated images and videos saved from your studio sessions.
            </p>
          </div>

          {/* Tab bar */}
          <div className="tab-bar" style={{ marginBottom: 28, maxWidth: 340 }}>
            <button
              className={`tab-btn${activeTab === "image" ? " active" : ""}`}
              onClick={() => setActiveTab("image")}
              id="gallery-tab-image"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                <ImageIcon /> Images
                <span style={{
                  padding: "1px 7px", borderRadius: 99, fontSize: "0.65rem", fontWeight: 700,
                  background: activeTab === "image" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                  color: activeTab === "image" ? "#fff" : "#6b7280",
                }}>{imgTotal}</span>
              </span>
            </button>
            <button
              className={`tab-btn${activeTab === "video" ? " active" : ""}`}
              onClick={() => setActiveTab("video")}
              id="gallery-tab-video"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                <VideoIcon /> Videos
                <span style={{
                  padding: "1px 7px", borderRadius: 99, fontSize: "0.65rem", fontWeight: 700,
                  background: activeTab === "video" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                  color: activeTab === "video" ? "#fff" : "#6b7280",
                }}>{vidTotal}</span>
              </span>
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div className="spinner animate-pulse-glow" />
            </div>
          )}

          {/* Images grid */}
          {!loading && activeTab === "image" && (
            images.length === 0
              ? <EmptyState type="image" />
              : <>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 16,
                  }}>
                    {images.map(img => (
                      <ImageCard
                        key={img.id}
                        item={img}
                        onDelete={handleDeleteImage}
                        onExpand={(item) => setLightboxIndex(images.findIndex(i => i.id === item.id))}
                      />
                    ))}
                  </div>
                  {hasMoreImages && (
                    <div style={{ textAlign: "center", marginTop: 32 }}>
                      <button
                        onClick={loadMoreImages}
                        style={{
                          padding: "12px 32px", borderRadius: 12,
                          background: "rgba(124,58,237,0.15)",
                          border: "1px solid rgba(124,58,237,0.3)",
                          color: "#a78bfa", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem",
                        }}
                      >Load More</button>
                    </div>
                  )}
                </>
          )}

          {/* Videos grid */}
          {!loading && activeTab === "video" && (
            videos.length === 0
              ? <EmptyState type="video" />
              : <>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 20,
                  }}>
                    {videos.map(vid => (
                      <VideoCard
                        key={vid.id}
                        item={vid}
                        onDelete={handleDeleteVideo}
                      />
                    ))}
                  </div>
                  {hasMoreVideos && (
                    <div style={{ textAlign: "center", marginTop: 32 }}>
                      <button
                        onClick={loadMoreVideos}
                        style={{
                          padding: "12px 32px", borderRadius: 12,
                          background: "rgba(124,58,237,0.15)",
                          border: "1px solid rgba(124,58,237,0.3)",
                          color: "#a78bfa", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem",
                        }}
                      >Load More</button>
                    </div>
                  )}
                </>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
