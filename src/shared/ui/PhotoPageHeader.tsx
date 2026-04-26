import Link from "next/link";

interface PhotoPageHeaderProps {
  contextLabel?: string;
  contextHref?: string;
  position?: string; // e.g. "8 / 48"
}

export function PhotoPageHeader({ contextLabel, contextHref, position }: PhotoPageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-canvas transition-colors duration-[250ms] flex items-center justify-between px-xl h-[60px] max-md:px-md max-md:h-[52px] flex-shrink-0">
      <Link
        href="/"
        className="font-mono font-bold text-[0.95rem] tracking-[-0.01em] text-primary no-underline focus-red"
        aria-label="ph1l74 — home"
      >
        ph<span className="text-accent">1</span>l74
      </Link>

      {contextLabel && (
        <div className="flex items-center gap-2 font-mono text-[0.66rem]">
          <Link
            href={contextHref ?? "#"}
            className="text-muted no-underline hover-primary transition-colors duration-150 focus-red"
          >
            {contextLabel}
          </Link>
          {position && (
            <>
              <span className="text-muted opacity-40" aria-hidden="true">›</span>
              <span className="text-muted">{position}</span>
            </>
          )}
        </div>
      )}
    </header>
  );
}
