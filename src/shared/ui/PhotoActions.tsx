"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  rawUrl: string;
}

export function PhotoActions({ rawUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="px-lg py-xl">
      <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
        Actions
      </span>
      <div className="flex flex-col gap-2">
        <a
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-mono text-[0.66rem] font-bold uppercase tracking-[0.06em] bg-panel-hi px-3 py-2 text-primary no-underline transition-colors duration-150 hover:bg-[var(--text)] hover:text-[var(--bg)] focus-red"
        >
          Open in raw
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center font-mono text-[0.66rem] font-bold uppercase tracking-[0.06em] bg-panel-hi px-3 py-2 text-primary transition-colors duration-150 hover:bg-[var(--text)] hover:text-[var(--bg)] focus-red border-none cursor-pointer"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
