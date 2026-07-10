"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ExifPanel } from "@/shared/ui/ExifPanel";
import { TagChip } from "@/shared/ui/TagChip";
import { PhotoActions } from "@/shared/ui/PhotoActions";
import { LocationMap } from "@/shared/ui/LocationMap";

interface PhotoSidebarProps {
  ctx: {
    label: string;
    href: string;
  } | null;
  exifEntries: Array<{ key: string; value: string }>;
  tags: Array<{ tag: { id: string; title: string } }>;
  gps: { lat: number; lon: number } | null;
  rawUrl: string;
  shotAtFormatted: string | null;
  publishedFormatted: string;
}

export function PhotoSidebar({
  ctx,
  exifEntries,
  tags,
  gps,
  rawUrl,
  shotAtFormatted,
  publishedFormatted,
}: PhotoSidebarProps) {
  const t = useTranslations("photo.sidebar");

  return (
    <aside className="bg-panel flex flex-col overflow-y-auto" aria-label={t("ariaLabel")}>
      {/* Context badge */}
      {ctx && (
        <>
          <div className="px-lg py-xl">
            <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
              {t("viewingFrom")}
            </span>
            <Link
              href={ctx.href}
              className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.06em] bg-panel-hi px-3 py-1 text-primary no-underline transition-colors duration-150 hover:bg-[var(--text)] hover:text-[var(--bg)] focus-red"
            >
              <span className="w-[5px] h-[5px] bg-[var(--red)] flex-shrink-0" aria-hidden="true" />
              {ctx.label}
            </Link>
          </div>
          <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
        </>
      )}

      {/* Date */}
      <div className="px-lg py-xl">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
          {shotAtFormatted ? t("shotOn") : t("published")}
        </span>
        <div className="font-mono text-[1.4rem] font-bold tracking-[-0.02em] leading-none">
          {shotAtFormatted ?? publishedFormatted}
        </div>
        {shotAtFormatted && (
          <div className="font-mono text-[0.66rem] text-muted mt-2">
            {t("published")} {publishedFormatted}
          </div>
        )}
      </div>

      {/* EXIF */}
      {exifEntries.length > 0 && (
        <>
          <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
          <div className="px-lg py-xl">
            <ExifPanel data={exifEntries} />
          </div>
        </>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <>
          <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
          <div className="px-lg py-xl">
            <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
              {t("tags")}
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map(({ tag }) => (
                <TagChip key={tag.id} href={`/tags/${tag.id}`} label={tag.title} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* GPS Map */}
      {gps && (
        <>
          <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
          <div className="px-lg pt-xl pb-0">
            <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
              {t("location")}
            </span>
          </div>
          <LocationMap lat={gps.lat} lon={gps.lon} />
        </>
      )}

      {/* Spacer pushes Actions to bottom */}
      <div className="flex-1" />

      <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
      <PhotoActions rawUrl={rawUrl} />
    </aside>
  );
}
