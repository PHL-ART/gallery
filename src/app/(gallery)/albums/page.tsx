import type { Metadata } from "next";
import { MotionAlbumGrid } from "@/shared/ui/MotionAlbumGrid";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbums } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Albums — Filat Astakhov",
  description: "All photo albums by Filat Astakhov",
  openGraph: { images: ["/api/og?type=listing&label=Albums"] },
};

export default async function AlbumsPage() {
  const albums = await getAlbums(false);

  return (
    <>
      <SectionHeading section="albums" count={albums.length} />

      <MotionAlbumGrid
        albums={albums.map((a) => ({
          id: a.id,
          title: a.title,
          photoCount: a._count.photos,
          coverSrc: a.photos[0] ? getPhotoUrl(a.photos[0].photo.s3Key) : undefined,
        }))}
      />
    </>
  );
}
