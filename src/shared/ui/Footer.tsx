import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto flex items-center justify-between px-xl pb-xl pt-[var(--space-3xl)] max-md:px-md max-md:pb-lg max-md:pt-[var(--space-2xl)]">
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
    </footer>
  );
}
