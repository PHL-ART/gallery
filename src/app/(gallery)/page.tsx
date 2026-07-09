import { AlbumCard } from "@/shared/ui/AlbumCard";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbums, getPhotos, getTags } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [photos, specialAlbums, regularAlbums, tags] = await Promise.all([
    getPhotos(),
    getAlbums(true),
    getAlbums(false),
    getTags(),
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
    { id: "latest", title: "Latest", count: photos.length, coverSrc: latestCover, href: "/latest" },
    { id: "special", title: "Special", count: specialAlbums.length, coverSrc: specialCover, href: "/special" },
    { id: "albums", title: "Albums", count: regularAlbums.length, coverSrc: albumsCover, href: "/albums" },
    { id: "tags", title: "Tags", count: tags.length, coverSrc: tagsCover, href: "/tags" },
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

        <div className="flex flex-col gap-md pb-2 max-md:pb-0">
          <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-accent">
            Street photographer
          </span>
          <p className="font-mono text-[0.78rem] text-muted leading-[1.9]">
            Based in Russia
            <br />
            Architecture and streets
            <br />
            Since 2008
          </p>
        </div>
      </section>

      <div className="px-xl mb-lg flex justify-between items-baseline max-md:px-md">
        <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
          Sections
        </span>
        <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
          4 collections
        </span>
      </div>

      <nav
        className="grid grid-cols-4 gap-md px-xl max-md:grid-cols-2 max-md:gap-sm max-md:px-md"
        aria-label="Browse sections"
      >
        {sections.map((s) => (
          <AlbumCard
            key={s.id}
            id={s.id}
            title={s.title}
            photoCount={s.count}
            coverSrc={s.coverSrc}
            href={s.href}
          />
        ))}
      </nav>
    </>
  );
}
