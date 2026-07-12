"use client";

import { useTranslations } from "next-intl";

export type Section = "latest" | "special" | "albums" | "tags";

interface Props {
  section: Section;
  count: number;
}

export function SectionHeading({ section, count }: Props) {
  const tn = useTranslations("nav");
  const ts = useTranslations("sections");

  return (
    <div className="px-xl pt-[var(--space-3xl)] pb-[var(--space-2xl)] grid grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-lg">
      <h1
        className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em]"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
      >
        {tn(section)}
      </h1>
      <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
        <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">
          {ts(`${section}Subtitle`)}
        </span>
        {ts(`${section}Count`, { count })}
      </div>
    </div>
  );
}
