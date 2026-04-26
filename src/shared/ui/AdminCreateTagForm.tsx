"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminCreateTagForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const name = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, title: title.trim() }),
    });
    setSaving(false);
    setTitle("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        placeholder="Tag title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-panel-hi px-3 py-2 font-mono text-xs text-primary focus:outline-none"
        style={{ border: "1px solid var(--surface-hi)" }}
        required
      />
      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-5 py-2 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40"
      >
        {saving ? "…" : "Create"}
      </button>
    </form>
  );
}
