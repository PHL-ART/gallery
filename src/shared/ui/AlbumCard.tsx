import Link from "next/link";
import Image from "next/image";

interface AlbumCardProps {
  id: string;
  title: string;
  photoCount?: number;
  coverSrc?: string;
  href?: string;
}

export function AlbumCard({ id, title, photoCount, coverSrc, href }: AlbumCardProps) {
  const target = href ?? `/albums/${id}`;

  return (
    <Link
      href={target}
      className="group flex flex-col gap-2 no-underline text-primary focus-red"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-panel">
        {coverSrc && (
          <Image
            src={coverSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-55 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="flex justify-between items-baseline px-1">
        <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em]">
          {title}
        </span>
        {photoCount !== undefined && (
          <span className="font-mono text-[0.6rem] text-muted">{photoCount}</span>
        )}
      </div>
    </Link>
  );
}
