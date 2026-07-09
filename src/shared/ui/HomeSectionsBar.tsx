// src/shared/ui/HomeSectionsBar.tsx
"use client";

import { useTranslations } from "next-intl";

interface Props {
  count: number;
}

export function HomeSectionsBar({ count }: Props) {
  const t = useTranslations("home");

  return (
    <div className="px-xl mb-lg flex justify-between items-baseline max-md:px-md">
      <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
        {t("sections")}
      </span>
      <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
        {t("collections", { count })}
      </span>
    </div>
  );
}
