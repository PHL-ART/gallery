import Link from "next/link";
import Image from "next/image";

interface PhotoCardProps {
  id: string;
  src: string;
  alt: string;
  tags?: string[];
  /** Pass as URL search string, e.g. "from=album&contextId=abc" */
  context?: string;
}

export function PhotoCard({ id, src, alt, tags = [], context }: PhotoCardProps) {
  const href = context ? `/photo/${id}?${context}` : `/photo/${id}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden aspect-[2/3] bg-panel focus-red"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover opacity-[0.72] transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
      />

      {tags.length > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 pt-12 px-2 pb-2 flex flex-wrap gap-1 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
          style={{
            background: "linear-gradient(transparent, oklch(0.06 0.004 25 / 0.92))",
          }}
          aria-hidden="true"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em]"
              style={{ color: "oklch(0.88 0.006 25)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
