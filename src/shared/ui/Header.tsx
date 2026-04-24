import Link from "next/link";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/latest", label: "Latest" },
  { href: "/special", label: "Special" },
  { href: "/albums", label: "Albums" },
  { href: "/tags", label: "Tags" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-canvas transition-colors duration-[250ms] flex items-center justify-between px-xl h-[60px] max-md:px-md max-md:h-[52px]">
      <Link
        href="/"
        className="font-mono font-bold text-[0.95rem] tracking-[-0.01em] text-primary no-underline focus-red"
        aria-label="ph1l74 — home"
      >
        ph<span className="text-accent">1</span>l74
      </Link>

      <div className="flex items-center gap-[var(--space-2xl)] max-md:gap-lg">
        <nav className="flex items-center gap-xl max-md:gap-md" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
