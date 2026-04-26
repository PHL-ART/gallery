import Link from "next/link";

interface TagChipProps {
  href: string;
  label: string;
  active?: boolean;
  count?: number;
}

export function TagChip({ href, label, active = false, count }: TagChipProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-2 font-mono text-[0.64rem] font-bold uppercase tracking-[0.08em]",
        "px-3 py-1 no-underline transition-colors duration-150 focus-red",
        active
          ? "bg-[var(--red)] text-[oklch(0.97_0.006_25)]"
          : "bg-panel text-muted hover:bg-[var(--text)] hover:text-[var(--bg)]",
      ].join(" ")}
    >
      {label}
      {count !== undefined && (
        <span className="opacity-60">{count}</span>
      )}
    </Link>
  );
}
