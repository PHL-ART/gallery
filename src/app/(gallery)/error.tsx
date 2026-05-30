"use client";
import { useEffect } from "react";

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-xl py-[var(--space-4xl)]">
      <div>
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
          Error
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em] mb-4"
          style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
        >
          Unavailable
        </h1>
        <p className="font-mono text-xs text-muted mb-6 max-w-xs leading-relaxed">
          Could not load page data. Make sure the database is running and
          DATABASE_URL is configured.
        </p>
        <button
          onClick={reset}
          className="font-mono text-xs font-bold uppercase tracking-[0.12em] bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 focus-red"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
