"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  src: string;
  prevHref: string | null;
  nextHref: string | null;
}

export function PhotoViewer({ src, prevHref, nextHref }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const router = useRouter();

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
    setZoomOrigin({ x: 50, y: 50 });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevHref, nextHref, router]);

  const handleLightboxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (zoom === 1) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x, y });
      setZoom(2.5);
    } else {
      setZoom(1);
      setZoomOrigin({ x: 50, y: 50 });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100svh-120px)] max-[900px]:min-h-[70vw] max-md:min-h-[calc(100svh-104px)] bg-canvas">
      {/* Zoomable thumbnail */}
      <motion.div
        className="relative w-full h-full min-h-[calc(100svh-120px)] max-[900px]:min-h-[70vw] max-md:min-h-[calc(100svh-104px)]"
        style={{ cursor: "zoom-in" }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.3, ease: [0.25, 0, 0.15, 1] }}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={src}
          alt="Photo"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 900px) 100vw, calc(100vw - 320px)"
        />
      </motion.div>

      {/* Navigation arrows */}
      {prevHref && (
        <Link
          href={prevHref}
          aria-label="Previous photo"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--text)] text-[var(--bg)] no-underline transition-colors duration-150 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] focus-red max-[900px]:left-2 max-[900px]:w-10 max-[900px]:h-10 z-10"
          style={{ cursor: "default" }}
        >
          ←
        </Link>
      )}
      {nextHref && (
        <Link
          href={nextHref}
          aria-label="Next photo"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--text)] text-[var(--bg)] no-underline transition-colors duration-150 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] focus-red max-[900px]:right-2 max-[900px]:w-10 max-[900px]:h-10 z-10"
          style={{ cursor: "default" }}
        >
          →
        </Link>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.92)" }}
          >
            {/* Zoom container */}
            <div
              className="relative w-screen h-screen overflow-hidden"
              onClick={handleLightboxClick}
              style={{ cursor: zoom > 1 ? "zoom-out" : "zoom-in" }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transform: `scale(${zoom})`,
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transition: "transform 0.3s ease",
                }}
              >
                <Image
                  src={src}
                  alt="Photo fullscreen"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-6 z-10 font-mono text-[1.6rem] leading-none text-white/60 hover:text-white bg-transparent border-none cursor-pointer focus-red p-1"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Close lightbox"
            >
              ×
            </button>

            {/* Hint */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] text-white/40 pointer-events-none whitespace-nowrap">
              {zoom > 1 ? "Click to zoom out · ESC to close" : "Click to zoom in · ESC to close"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
