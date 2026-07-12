import type { Metadata } from "next";
import { MotionPhotoGrid } from "@/shared/ui/MotionPhotoGrid";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getPhotos } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest — Filat Astakhov",
  description: "Latest photos by Filat Astakhov",
  openGraph: { images: ["/api/og?type=listing&label=Latest"] },
};

export default async function LatestPage() {
  const photos = await getPhotos();

  return (
    <>
      <SectionHeading section="latest" count={photos.length} />

      <MotionPhotoGrid
        photos={photos.map((p) => ({
          id: p.id,
          src: getPhotoUrl(p.s3Key),
          alt: "Street photo",
          tags: p.tags.map((pt) => pt.tag.title),
        }))}
      />
    </>
  );
}
