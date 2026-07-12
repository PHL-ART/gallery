import type { Metadata } from "next";
import { MotionPhotoGrid } from "@/shared/ui/MotionPhotoGrid";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getTag } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tag = await getTag(id);
  return {
    title: `#${tag.title} — Filat Astakhov`,
    description: `${tag.photos.length} photos tagged ${tag.title}`,
    openGraph: {
      images: [`/api/og?type=tag&id=${id}`],
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { id } = await params;
  const tag = await getTag(id);
  const context = `from=tag&contextId=${id}`;

  return (
    <>
      <div className="px-xl pt-[var(--space-3xl)] pb-[var(--space-2xl)] grid grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-lg">
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
          {tag.title}
        </h1>
        <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
          <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">Tag</span>
          {tag.photos.length} photos
        </div>
      </div>

      <MotionPhotoGrid
        photos={tag.photos.map(({ photo }) => ({
          id: photo.id,
          src: getPhotoUrl(photo.s3Key),
          alt: `Photo tagged ${tag.title}`,
          context,
        }))}
      />
    </>
  );
}
