"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Icons ────────────────────────────────────────────────────────────────────
const RestoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const TrashForeverIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    <line x1="4" y1="4" x2="20" y2="20" stroke="#ef4444"/>
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
const GalleryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div style={{
        background: "linear-gradient(145deg,rgba(20,16,40,0.98),rgba(15,12,32,0.98))",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 16, padding: "28px 32px",
        maxWidth: 400, width: "90%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "1.5rem", textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Permanent Delete</p>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px", borderRadius: 10,
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            border: "none", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem",
          }}>Delete Forever</button>
        </div>
      </div>
    </div>
  );
}

// ── Image Trash Card ──────────────────────────────────────────────────────────
function ImageTrashCard({ item, onRestore, onPermanentDelete }) {
  const [hovered, setHovered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRestore = async () => {
    setBusy(true);
    try {
      await fetch(`/api/gallery/images/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      onRestore(item.id);
    } catch (e) { console.error(e); setBusy(false); }
  };

  const handlePermanentDelete = async () => {
    setBusy(true);
    setConfirmOpen(false);
    try {
      await fetch(`/api/gallery/images/${item.id}?permanent=true`, { method: "DELETE" });
      onPermanentDelete(item.id);
    } catch (e) { console.error(e); setBusy(false); }
  };

  return (
    <>
      <div
        style={{
          position: "relative", borderRadius: 14, overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(239,68,68,0.15)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.3)",
          opacity: busy ? 0.4 : 1,
          pointerEvents: busy ? "none" : "auto",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        id={`trash-img-${item.id}`}
      >
        {/* Deleted badge */}
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          padding: "3px 8px", borderRadius: 6,
          background: "rgba(239,68,68,0.2)", backdropFilter: "blur(4px)",
          border: "1px solid rgba(239,68,68,0.3)",
          fontSize: "0.6rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.05em",
        }}>DELETED</div>

        <img
          src={item.image_url}
          alt={item.prompt}
          style={{ width: "100%", display: "block", aspectRatio: "1", objectFit: "cover", filter: "grayscale(40%) brightness(0.7)" }}
        />

        <div style={{ padding: "12px 14px" }}>
          <p style={{
            fontSize: "0.72rem", color: "#9ca3af", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            marginBottom: 4,
          }}>{item.prompt}</p>
          <p style={{ fontSize: "0.62rem", color: "#4b5563", marginBottom: 10 }}>
            Deleted {formatDate(item.deleted_at)}
          </p>
          <div style={{ display: "flex", gap: 7 }}>
            <button
              onClick={handleRestore}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 10px", borderRadius: 9,
                background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa", cursor: "pointer", fontWeight: 600, fontSize: "0.75rem",
              }}
            ><RestoreIcon /> Restore</button>
            <button
              onClick={() => setConfirmOpen(true)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 10px", borderRadius: 9,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.75rem",
              }}
            ><TrashForeverIcon /> Delete Forever</button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          message="This image will be permanently deleted and cannot be recovered."
          onConfirm={handlePermanentDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}

// ── Video Trash Card ──────────────────────────────────────────────────────────
function VideoTrashCard({ item, onRestore, onPermanentDelete }) {
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRestore = async () => {
    setBusy(true);
    try {
      await fetch(`/api/gallery/videos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      onRestore(item.id);
    } catch (e) { console.error(e); setBusy(false); }
  };

  const handlePermanentDelete = async () => {
    setBusy(true);
    setConfirmOpen(false);
    try {
      await fetch(`/api/gallery/videos/${item.id}?permanent=true`, { method: "DELETE" });
      onPermanentDelete(item.id);
    } catch (e) { console.error(e); setBusy(false); }
  };

  return (
    <>
      <div
        style={{
          borderRadius: 14, overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(239,68,68,0.15)",
          opacity: busy ? 0.4 : 1,
          pointerEvents: busy ? "none" : "auto",
          position: "relative",
        }}
        id={`trash-vid-${item.id}`}
      >
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          padding: "3px 8px", borderRadius: 6,
          background: "rgba(239,68,68,0.2)", backdropFilter: "blur(4px)",
          border: "1px solid rgba(239,68,68,0.3)",
          fontSize: "0.6rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.05em",
        }}>DELETED</div>

        <video
          src={item.video_url}
          controls
          style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover", background: "#000", filter: "grayscale(40%) brightness(0.7)" }}
        />

        <div style={{ padding: "12px 14px" }}>
          <p style={{
            fontSize: "0.72rem", color: "#9ca3af", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            marginBottom: 4,
          }}>{item.prompt}</p>
          <p style={{ fontSize: "0.62rem", color: "#4b5563", marginBottom: 10 }}>
            Deleted {formatDate(item.deleted_at)}
          </p>
          <div style={{ display: "flex", gap: 7 }}>
            <button
              onClick={handleRestore}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 10px", borderRadius: 9,
                background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa", cursor: "pointer", fontWeight: 600, fontSize: "0.75rem",
              }}
            ><RestoreIcon /> Restore</button>
            <button
              onClick={() => setConfirmOpen(true)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 10px", borderRadius: 9,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.75rem",
              }}
            ><TrashForeverIcon /> Delete Forever</button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          message="This video will be permanently deleted and cannot be recovered."
          onConfirm={handlePermanentDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}

// ── Empty Trash ───────────────────────────────────────────────────────────────
function EmptyTrash({ type }) {
  return (
    <div style={{
      textAlign: "center", padding: "80px 20px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 72, height: 72,
        background: "rgba(239,68,68,0.08)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem",
      }}>🗑</div>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>
        No deleted {type === "image" ? "images" : "videos"}. Trash is empty!
      </p>
      <Link href="/gallery" style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "10px 20px",
        background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 10, color: "#a78bfa", fontSize: "0.85rem",
        fontWeight: 600, textDecoration: "none",
      }}>
        <GalleryIcon /> Back to Gallery
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrashPage() {
  const [activeTab, setActiveTab] = useState("image");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgTotal, setImgTotal] = useState(0);
  const [vidTotal, setVidTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [imgRes, vidRes] = await Promise.all([
        fetch("/api/trash/images?limit=100"),
        fetch("/api/trash/videos?limit=100"),
      ]);
      const imgData = await imgRes.json();
      const vidData = await vidRes.json();
      setImages(imgData.items || []);
      setImgTotal(imgData.total || 0);
      setVideos(vidData.items || []);
      setVidTotal(vidData.total || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRestoreImage = (id) => {
    setImages(prev => prev.filter(i => i.id !== id));
    setImgTotal(t => t - 1);
  };
  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(i => i.id !== id));
    setImgTotal(t => t - 1);
  };
  const handleRestoreVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setVidTotal(t => t - 1);
  };
  const handleDeleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setVidTotal(t => t - 1);
  };

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
            }}>🏠 Studio</Link>
            <Link href="/gallery" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
            }}><GalleryIcon /> Gallery</Link>
          </nav>
        </header>

        <main style={{ flex: 1, padding: "32px 24px 48px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6, color: "#f87171" }}>
              🗑 Trash
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Soft-deleted items. Restore them or delete forever.
            </p>
          </div>

          {/* Tab bar */}
          <div className="tab-bar" style={{ marginBottom: 28, maxWidth: 340 }}>
            <button
              className={`tab-btn${activeTab === "image" ? " active" : ""}`}
              onClick={() => setActiveTab("image")}
              id="trash-tab-image"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                <ImageIcon /> Images
                {imgTotal > 0 && (
                  <span style={{
                    padding: "1px 7px", borderRadius: 99, fontSize: "0.65rem", fontWeight: 700,
                    background: "rgba(239,68,68,0.2)", color: "#ef4444",
                  }}>{imgTotal}</span>
                )}
              </span>
            </button>
            <button
              className={`tab-btn${activeTab === "video" ? " active" : ""}`}
              onClick={() => setActiveTab("video")}
              id="trash-tab-video"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
                <VideoIcon /> Videos
                {vidTotal > 0 && (
                  <span style={{
                    padding: "1px 7px", borderRadius: 99, fontSize: "0.65rem", fontWeight: 700,
                    background: "rgba(239,68,68,0.2)", color: "#ef4444",
                  }}>{vidTotal}</span>
                )}
              </span>
            </button>
          </div>

          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div className="spinner animate-pulse-glow" />
            </div>
          )}

          {!loading && activeTab === "image" && (
            images.length === 0
              ? <EmptyTrash type="image" />
              : <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16,
                }}>
                  {images.map(img => (
                    <ImageTrashCard
                      key={img.id}
                      item={img}
                      onRestore={handleRestoreImage}
                      onPermanentDelete={handleDeleteImage}
                    />
                  ))}
                </div>
          )}

          {!loading && activeTab === "video" && (
            videos.length === 0
              ? <EmptyTrash type="video" />
              : <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 20,
                }}>
                  {videos.map(vid => (
                    <VideoTrashCard
                      key={vid.id}
                      item={vid}
                      onRestore={handleRestoreVideo}
                      onPermanentDelete={handleDeleteVideo}
                    />
                  ))}
                </div>
          )}
        </main>
      </div>
    </>
  );
}
