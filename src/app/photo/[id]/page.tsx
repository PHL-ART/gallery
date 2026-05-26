import type { Metadata } from "next";
import Link from "next/link";
import { PhotoPageHeader } from "@/shared/ui/PhotoPageHeader";
import { ExifPanel } from "@/shared/ui/ExifPanel";
import { TagChip } from "@/shared/ui/TagChip";
import { Footer } from "@/shared/ui/Footer";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getPhoto } from "@/shared/lib/queries";
import { prisma } from "@/shared/lib/prisma";
import { PhotoViewer } from "@/shared/ui/PhotoViewer";
import { PhotoActions } from "@/shared/ui/PhotoActions";
import { LocationMap } from "@/shared/ui/LocationMap";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
  searchParams: { from?: string; contextId?: string };
}

function transformExif(
  raw: Record<string, string>
): Array<{ key: string; value: string }> {
  const out: Array<{ key: string; value: string }> = [];

  // Merge Make + Model → Camera
  const camera = [raw.Make ?? "", raw.Model ?? ""].filter(Boolean).join(" ");
  if (camera) out.push({ key: "Camera", value: camera });

  if (raw.LensModel) out.push({ key: "LensModel", value: raw.LensModel });
  if (raw.ISO) out.push({ key: "ISO", value: raw.ISO });
  if (raw.FNumber) out.push({ key: "FNumber", value: raw.FNumber });

  // ExposureTime float → "1/N" or "Ns"
  if (raw.ExposureTime) {
    const n = parseFloat(raw.ExposureTime);
    let formatted: string;
    if (!isNaN(n) && n > 0) {
      if (n < 1) {
        formatted = `1/${Math.round(1 / n)}`;
      } else {
        formatted = n === 1 ? "1s" : `${n}s`;
      }
    } else {
      formatted = raw.ExposureTime;
    }
    out.push({ key: "ExposureTime", value: formatted });
  }

  // FocalLength + "mm" suffix, rename label
  if (raw.FocalLength) {
    out.push({ key: "Focal length", value: `${raw.FocalLength} mm` });
  }

  // DateTimeOriginal → "YYYY.MM.DD HH:MM"
  if (raw.DateTimeOriginal) {
    let d = new Date(raw.DateTimeOriginal);
    // Fallback: handle raw EXIF format "YYYY:MM:DD HH:MM:SS"
    if (isNaN(d.getTime())) {
      const normalized = raw.DateTimeOriginal.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
      d = new Date(normalized);
    }
    if (!isNaN(d.getTime())) {
      const p = (n: number) => String(n).padStart(2, "0");
      const fmt = `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
      out.push({ key: "Date", value: fmt });
    } else {
      out.push({ key: "DateTimeOriginal", value: raw.DateTimeOriginal });
    }
  }

  // latitude/longitude NOT included here — shown via LocationMap instead
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await getPhoto(params.id);
  return { title: "Photo — ph1l74" };
}

async function getContext(
  from: string | undefined,
  contextId: string | undefined,
  photoId: string
) {
  if (!from || !contextId) return null;

  if (from === "album") {
    const album = await prisma.album.findUnique({
      where: { id: contextId },
      include: {
        photos: {
          orderBy: { photo: { publishedAt: "desc" } },
          select: { photoId: true },
        },
      },
    });
    if (!album) return null;

    const ids = album.photos.map((p) => p.photoId);
    const idx = ids.indexOf(photoId);

    return {
      label: album.title,
      href: `/albums/${contextId}`,
      position: idx >= 0 ? `${idx + 1} / ${ids.length}` : undefined,
      prevId: idx > 0 ? ids[idx - 1] : null,
      nextId: idx < ids.length - 1 ? ids[idx + 1] : null,
    };
  }

  if (from === "tag") {
    const tag = await prisma.tag.findUnique({
      where: { id: contextId },
      include: {
        photos: {
          orderBy: { photo: { publishedAt: "desc" } },
          select: { photoId: true },
        },
      },
    });
    if (!tag) return null;

    const ids = tag.photos.map((p) => p.photoId);
    const idx = ids.indexOf(photoId);

    return {
      label: tag.title,
      href: `/tags/${contextId}`,
      position: idx >= 0 ? `${idx + 1} / ${ids.length}` : undefined,
      prevId: idx > 0 ? ids[idx - 1] : null,
      nextId: idx < ids.length - 1 ? ids[idx + 1] : null,
    };
  }

  return null;
}

export default async function PhotoPage({ params, searchParams }: Props) {
  const { from, contextId } = searchParams;
  const [photo, ctx] = await Promise.all([
    getPhoto(params.id),
    getContext(from, contextId, params.id),
  ]);

  const src = getPhotoUrl(photo.s3Key);
  const contextQuery = ctx ? `from=${from}&contextId=${contextId}` : undefined;

  const prevHref = ctx?.prevId
    ? `/photo/${ctx.prevId}${contextQuery ? `?${contextQuery}` : ""}`
    : null;
  const nextHref = ctx?.nextId
    ? `/photo/${ctx.nextId}${contextQuery ? `?${contextQuery}` : ""}`
    : null;

  const rawExif = photo.exifData as Record<string, string> | null;

  const gps = (() => {
    if (!rawExif?.latitude || !rawExif?.longitude) return null;
    const lat = parseFloat(rawExif.latitude);
    const lon = parseFloat(rawExif.longitude);
    return !isNaN(lat) && !isNaN(lon) ? { lat, lon } : null;
  })();

  const exifEntries = rawExif ? transformExif(rawExif) : [];

  const shotAtFormatted = photo.shotAt
    ? new Date(photo.shotAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\./g, ".")
    : null;

  const publishedFormatted = new Date(photo.publishedAt).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).replace(/\./g, ".");

  return (
    <>
      <PhotoPageHeader
        contextLabel={ctx?.label}
        contextHref={ctx?.href}
        position={ctx?.position}
      />

      <div className="grid grid-cols-[1fr_320px] flex-1 min-h-0 max-[900px]:grid-cols-1">
        {/* Photo pane */}
        <PhotoViewer src={src} prevHref={prevHref} nextHref={nextHref} />

        {/* Sidebar */}
        <aside className="bg-panel flex flex-col overflow-y-auto" aria-label="Photo details">
          {/* Context badge */}
          {ctx && (
            <>
              <div className="px-lg py-xl">
                <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
                  Viewing from
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
              {shotAtFormatted ? "Shot on" : "Published"}
            </span>
            <div className="font-mono text-[1.4rem] font-bold tracking-[-0.02em] leading-none">
              {shotAtFormatted ?? publishedFormatted}
            </div>
            {shotAtFormatted && (
              <div className="font-mono text-[0.66rem] text-muted mt-2">
                Published {publishedFormatted}
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
          {photo.tags.length > 0 && (
            <>
              <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
              <div className="px-lg py-xl">
                <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map(({ tag }) => (
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
                  Location
                </span>
              </div>
              <LocationMap lat={gps.lat} lon={gps.lon} />
            </>
          )}

          {/* Spacer pushes Actions to bottom */}
          <div className="flex-1" />

          <div className="h-px mx-lg" style={{ background: "var(--surface-hi)" }} />
          <PhotoActions rawUrl={src} />
        </aside>
      </div>

      <Footer />
    </>
  );
}
