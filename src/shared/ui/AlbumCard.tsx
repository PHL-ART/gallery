import Link from "next/link";
import Image from "next/image";

interface AlbumCardProps {
  id: string;
  title: string;
  photoCount?: number;
  coverSrc?: string;
  href?: string;
}

export function AlbumCard({ id, title, coverSrc, href }: AlbumCardProps) {
  const target = href ?? `/albums/${id}`;

  return (
    <Link
      href={target}
      className="group block no-underline text-primary focus-red"
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

        {/* Тёмный оверлей поверх фото */}
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />

        {/* Название — поверх фото, в центре. При hover плавно исчезает */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="font-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white drop-shadow-sm text-center px-3">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}
