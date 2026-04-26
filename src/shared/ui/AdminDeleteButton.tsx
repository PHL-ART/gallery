"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  url: string;
  label?: string;
  redirectTo?: string;
}

export function AdminDeleteButton({ url, label = "Delete", redirectTo }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[var(--red)] hover:opacity-70 transition-opacity disabled:opacity-40"
        >
          {loading ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted hover:text-primary transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted hover:text-[var(--red)] transition-colors"
    >
      {label}
    </button>
  );
}
