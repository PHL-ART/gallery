"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

interface ExifEntry {
  key: string;
  value: string;
}

const EXIF_TRANSLATABLE_KEYS = [
  "Camera", "Lens", "ISO", "FNumber", "ExposureTime", "Focal length", "Date",
] as const;
type ExifKey = (typeof EXIF_TRANSLATABLE_KEYS)[number];

export function ExifPanel({ data }: { data: ExifEntry[] }) {
  const [open, setOpen] = useState(true);
  const t = useTranslations("photo.exif");

  const label = (key: string): string => {
    if (EXIF_TRANSLATABLE_KEYS.includes(key as ExifKey)) {
      return t(key as ExifKey);
    }
    return key;
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="exif-data"
          className={[
            "w-7 h-7 flex items-center justify-center flex-shrink-0",
            "font-mono text-[0.75rem] font-bold border-none cursor-pointer",
            "transition-colors duration-150 focus-red",
            open
              ? "bg-[var(--red)] text-[oklch(0.97_0.006_25)]"
              : "bg-panel-hi text-primary hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)]",
          ].join(" ")}
        >
          i
        </button>
        <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.1em] text-muted">
          {t("info")}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="exif-data"
            key="exif-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0, 0.15, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-2">
              {data.map(({ key, value }) => (
                <div key={key} className="flex justify-between items-baseline gap-4">
                  <span className="font-mono text-[0.66rem] text-muted whitespace-nowrap">
                    {label(key)}
                  </span>
                  <span className="font-mono text-[0.66rem] font-bold text-right">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
