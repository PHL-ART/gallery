import { AlbumCard } from "@/shared/ui/AlbumCard";
import { HomeDescription } from "@/shared/ui/HomeDescription";
import { HomeSectionsBar } from "@/shared/ui/HomeSectionsBar";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbums, getPhotos } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [photos, specialAlbums, regularAlbums] = await Promise.all([
    getPhotos(),
    getAlbums(true),
    getAlbums(false),
  ]);

  const latestCover = photos[0] ? getPhotoUrl(photos[0].s3Key) : undefined;
  const specialCover = specialAlbums[0]?.photos[0]
    ? getPhotoUrl(specialAlbums[0].photos[0].photo.s3Key)
    : undefined;
  const albumsCover = regularAlbums[0]?.photos[0]
    ? getPhotoUrl(regularAlbums[0].photos[0].photo.s3Key)
    : undefined;
  const tagsCover = photos[1] ? getPhotoUrl(photos[1].s3Key) : undefined;

  const sections = [
    { id: "latest",  title: "Latest",  coverSrc: latestCover,  href: "/latest"  },
    { id: "special", title: "Special", coverSrc: specialCover, href: "/special" },
    { id: "albums",  title: "Albums",  coverSrc: albumsCover,  href: "/albums"  },
    { id: "tags",    title: "Tags",    coverSrc: tagsCover,    href: "/tags"    },
  ];

  return (
    <>
      <section
        className="px-xl pt-[var(--space-3xl)] pb-[var(--space-3xl)] grid grid-cols-[1fr_240px] gap-[var(--space-3xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-xl"
        aria-label="Photographer introduction"
      >
        <h1
          className="font-display font-black uppercase leading-[0.87] tracking-[-0.02em]"
          style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
        >
          Filat
          <br />
          <span className="text-accent">Astakhov</span>
        </h1>

        <HomeDescription />
      </section>

      <HomeSectionsBar count={sections.length} />

      <nav
        className="grid grid-cols-4 gap-md px-xl max-md:grid-cols-2 max-md:gap-sm max-md:px-md"
        aria-label="Browse sections"
      >
        {sections.map((s) => (
          <AlbumCard
            key={s.id}
            id={s.id}
            title={s.title}
            coverSrc={s.coverSrc}
            href={s.href}
          />
        ))}
      </nav>
    </>
  );
}
