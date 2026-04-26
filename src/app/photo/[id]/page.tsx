import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhotoPageHeader } from "@/shared/ui/PhotoPageHeader";
import { ExifPanel } from "@/shared/ui/ExifPanel";
import { TagChip } from "@/shared/ui/TagChip";
import { Footer } from "@/shared/ui/Footer";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getPhoto } from "@/shared/lib/queries";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
  searchParams: { from?: string; contextId?: string };
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

  const exifEntries = photo.exifData
    ? Object.entries(photo.exifData as Record<string, string>).map(([key, value]) => ({
        key,
        value,
      }))
    : [];

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
        <div
          className="relative flex items-center justify-center min-h-[calc(100svh-60px)] max-[900px]:min-h-[70vw]"
          style={{ background: "oklch(0.06 0.004 25)" }}
        >
          <Image
            src={src}
            alt="Street photo"
            width={1200}
            height={1600}
            priority
            className="max-w-full object-contain"
            style={{ maxHeight: "calc(100svh - 60px)" }}
          />

          {prevHref && (
            <Link
              href={prevHref}
              aria-label="Previous photo"
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--text)] text-[var(--bg)] no-underline transition-colors duration-150 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] focus-red max-[900px]:left-2 max-[900px]:w-10 max-[900px]:h-10"
            >
              ←
            </Link>
          )}

          {nextHref && (
            <Link
              href={nextHref}
              aria-label="Next photo"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--text)] text-[var(--bg)] no-underline transition-colors duration-150 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] focus-red max-[900px]:right-2 max-[900px]:w-10 max-[900px]:h-10"
            >
              →
            </Link>
          )}
        </div>

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
        </aside>
      </div>

      <Footer />
    </>
  );
}
