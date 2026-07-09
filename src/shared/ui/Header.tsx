// src/shared/ui/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/shared/config/nav";

export function Header() {
  const pathname = usePathname();
  const showHome = pathname !== "/";

  return (
    <header className="sticky top-0 z-50 bg-canvas transition-colors duration-[250ms] flex items-center justify-between px-xl h-[60px] max-md:px-md max-md:h-[52px]">
      {/* Навигация: Home (если не на главной) + основные ссылки */}
      <nav className="flex items-center gap-xl max-md:gap-md" aria-label="Main navigation">
        {showHome && (
          <NavLink href="/">Home</NavLink>
        )}
        {NAV_LINKS.map(({ href, label }) => (
          <NavLink key={href} href={href}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Настройки сайта: тема и язык, разделены красной точкой */}
      <div className="flex items-center gap-md">
        <ThemeToggle />
        <span className="text-accent font-bold" aria-hidden="true">·</span>
        {/* LanguageSwitcher будет добавлен в Task 5 */}
        <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted">EN</span>
      </div>
    </header>
  );
}
