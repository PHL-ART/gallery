"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Props {
  rawUrl: string;
}

export function PhotoActions({ rawUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const t = useTranslations("photo.sidebar");

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
        {t("actions")}
      </span>
      <div className="flex flex-col gap-2">
        <a
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-mono text-[0.66rem] font-bold uppercase tracking-[0.06em] bg-panel-hi px-3 py-2 text-primary no-underline transition-colors duration-150 hover:bg-[var(--text)] hover:text-[var(--bg)] focus-red"
        >
          {t("openInRaw")}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center font-mono text-[0.66rem] font-bold uppercase tracking-[0.06em] bg-panel-hi px-3 py-2 text-primary transition-colors duration-150 hover:bg-[var(--text)] hover:text-[var(--bg)] focus-red border-none cursor-pointer"
        >
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}
