"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminCreateAlbumForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const name = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        title: title.trim(),
        description: description.trim() || undefined,
        isSpecial,
      }),
    });
    setSaving(false);
    setTitle("");
    setDescription("");
    setIsSpecial(false);
    router.refresh();
  }

  const inputCls =
    "bg-panel-hi px-3 py-2 font-mono text-xs text-primary focus:outline-none w-full";
  const border = { border: "1px solid var(--surface-hi)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputCls}
        style={border}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputCls}
        style={border}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isSpecial}
          onChange={(e) => setIsSpecial(e.target.checked)}
          className="accent-[var(--red)]"
        />
        <span className="font-mono text-xs text-muted">
          Special (curated series shown on /special)
        </span>
      </label>
      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-5 py-2 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40"
      >
        {saving ? "Creating…" : "Create album"}
      </button>
    </form>
  );
}
