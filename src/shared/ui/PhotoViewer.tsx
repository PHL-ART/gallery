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
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevHref, nextHref, router]);

  return (
    <div
      className="relative flex items-center justify-center min-h-[calc(100svh-60px)] max-[900px]:min-h-[70vw] bg-canvas"
    >
      {/* Zoomable image */}
      <motion.div
        className="relative w-full h-full min-h-[calc(100svh-60px)] max-[900px]:min-h-[70vw]"
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.92)", cursor: "zoom-out" }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative w-screen h-screen">
              <Image
                src={src}
                alt="Photo fullscreen"
                fill
                priority
                className="object-contain"
                sizes="100vw"
                style={{ cursor: "zoom-out" }}
              />
            </div>
            <span
              className="absolute top-4 right-6 font-mono text-[0.66rem] text-white/50 pointer-events-none"
            >
              ESC / click to close
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
