"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";

interface PhotoPageHeaderProps {
  contextLabel?: string;
  contextHref?: string;
  position?: string;
}

export function PhotoPageHeader({ contextLabel, contextHref, position }: PhotoPageHeaderProps) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 bg-canvas transition-colors duration-[250ms] flex items-center justify-between px-xl h-[60px] max-md:px-md max-md:h-[52px] flex-shrink-0">
      <div className="flex items-center gap-xl max-md:gap-md">
        <Link
          href="/"
          className="font-mono font-bold text-[0.66rem] uppercase tracking-[0.12em] text-muted hover-primary no-underline transition-colors duration-150 focus-red"
        >
          {t("home")}
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
      </div>

      <div className="flex items-center gap-md">
        <ThemeToggle />
        <span className="text-accent font-bold" aria-hidden="true">·</span>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
