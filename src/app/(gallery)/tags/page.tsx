import type { Metadata } from "next";
import { TagChip } from "@/shared/ui/TagChip";
import { SectionHeading } from "@/shared/ui/SectionHeading";
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
      <SectionHeading section="tags" count={tags.length} />

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
