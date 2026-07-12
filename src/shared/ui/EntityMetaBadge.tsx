"use client";

import { useTranslations } from "next-intl";

interface Props {
  type: "tag" | "special" | "album";
  count: number;
}

export function EntityMetaBadge({ type, count }: Props) {
  const t = useTranslations("entity");

  return (
    <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
      {type !== "album" && (
        <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">
          {type === "tag" ? t("tagLabel") : t("specialLabel")}
        </span>
      )}
      {t("photoCount", { count })}
    </div>
  );
}
