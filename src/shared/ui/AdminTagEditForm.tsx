"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tag: { id: string; title: string; description: string };
}

export function AdminTagEditForm({ tag }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(tag.title);
  const [description, setDescription] = useState(tag.description);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/tags/${tag.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: description || undefined }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const inputCls =
    "bg-panel-hi px-3 py-2 font-mono text-xs text-primary focus:outline-none w-full";
  const border = { border: "1px solid var(--surface-hi)" };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          style={border}
        />
      </div>
      <div>
        <label className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
          style={border}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !title.trim()}
        className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40"
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
      </button>
    </div>
  );
}
