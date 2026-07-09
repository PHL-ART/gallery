// src/shared/ui/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_LINKS } from "@/shared/config/nav";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const showHome = pathname !== "/";

  return (
    <header className="sticky top-0 z-50 bg-canvas transition-colors duration-[250ms] flex items-center justify-between px-xl h-[60px] max-md:px-md max-md:h-[52px]">
      <nav className="flex items-center gap-xl max-md:gap-md" aria-label="Main navigation">
        {showHome && (
          <NavLink href="/">{t("home")}</NavLink>
        )}
        {NAV_LINKS.map(({ href, tKey }) => (
          <NavLink key={href} href={href}>
            {t(tKey)}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-md">
        <ThemeToggle />
        <span className="text-accent font-bold" aria-hidden="true">·</span>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
