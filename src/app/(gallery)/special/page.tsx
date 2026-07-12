import type { Metadata } from "next";
import { MotionAlbumGrid } from "@/shared/ui/MotionAlbumGrid";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbums } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Special — Filat Astakhov",
  description: "Curated special series by Filat Astakhov",
  openGraph: { images: ["/api/og?type=listing&label=Special"] },
};

export default async function SpecialPage() {
  const albums = await getAlbums(true);

  return (
    <>
      <SectionHeading section="special" count={albums.length} />

      <MotionAlbumGrid
        cols={4}
        albums={albums.map((a) => ({
          id: a.id,
          title: a.title,
          photoCount: a._count.photos,
          coverSrc: a.photos[0] ? getPhotoUrl(a.photos[0].photo.s3Key) : undefined,
          href: `/albums/${a.id}`,
        }))}
      />
    </>
  );
}
