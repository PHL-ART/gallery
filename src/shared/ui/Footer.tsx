import Link from "next/link";

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact }: FooterProps) {
  const year = new Date().getFullYear();

  const inner = (
    <>
      <span className="font-mono text-[0.6rem] text-muted tracking-[0.06em]">
        © {year} Filat Astakhov
      </span>
      <Link
        href="/"
        className="font-mono text-[0.65rem] text-muted no-underline focus-red"
        aria-label="Back to home"
      >
        ph<span className="text-accent">1</span>l74
      </Link>
    </>
  );

  if (compact) {
    return (
      <footer className="flex items-center justify-between px-xl h-[60px] flex-shrink-0 max-md:px-md max-md:h-[52px]">
        {inner}
      </footer>
    );
  }

  return (
    <footer className="mt-auto flex items-center justify-between px-xl pb-xl pt-[var(--space-3xl)] max-md:px-md max-md:pb-lg max-md:pt-[var(--space-2xl)]">
      {inner}
    </footer>
  );
}
