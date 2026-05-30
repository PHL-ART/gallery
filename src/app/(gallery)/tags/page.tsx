import type { Metadata } from "next";
import { TagChip } from "@/shared/ui/TagChip";
import { getTags } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags — Filat Astakhov",
  description: "Browse photos by tags",
  openGraph: { images: ["/api/og?type=listing&label=Tags"] },
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <>
      <div className="px-xl pt-[var(--space-3xl)] pb-[var(--space-2xl)] grid grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-lg">
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
          Tags
        </h1>
        <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
          <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">Keywords</span>
          {tags.length} tags
        </div>
      </div>

      <div className="px-xl pb-[var(--space-3xl)] max-md:px-md">
        <div className="flex flex-wrap gap-sm">
          {tags.map((tag) => (
            <TagChip
              key={tag.id}
              href={`/tags/${tag.id}`}
              label={tag.title}
              count={tag._count.photos}
            />
          ))}
        </div>
      </div>
    </>
  );
}
