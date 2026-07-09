// src/shared/ui/HomeDescription.tsx
"use client";

import { useTranslations } from "next-intl";

export function HomeDescription() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-md pb-2 max-md:pb-0">
      <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-accent">
        {t("role")}
      </span>
      <p className="font-mono text-[0.78rem] text-muted leading-[1.9]">
        {t("location")}
        <br />
        {t("style")}
        <br />
        {t("since")}
      </p>
    </div>
  );
}
