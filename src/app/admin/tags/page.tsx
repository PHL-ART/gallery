"use client";

import { useEffect, useState } from "react";

type Tag = {
  slug: string;
  name: string;
};

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    const res = await fetch("/api/admin/tags", { credentials: "include" });
    const data = (await res.json()) as { tags: Tag[] };
    setTags(data.tags);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function createTag() {
    const payload = {
      name,
      slug: slug.trim() ? slug : undefined,
    };

    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to create tag");
      return;
    }

    setName("");
    setSlug("");
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Тэги</h1>

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="font-medium">Создать</h2>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Название
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Slug (опционально)
            </span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => void createTag()}
          disabled={!name.trim() || loading}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          Создать
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-medium">Список</h2>

        {loading ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Загрузка...
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {tags.map((t) => (
              <TagRow key={t.slug} tag={t} onSaved={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TagRow({
  tag,
  onSaved,
}: {
  tag: Tag;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(tag.name);

  async function save() {
    const res = await fetch(`/api/admin/tags/${encodeURIComponent(tag.slug)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to update tag");
      return;
    }

    await onSaved();
  }

  async function del() {
    if (!confirm(`Удалить тэг "${tag.name}"?`)) return;

    const res = await fetch(`/api/admin/tags/${encodeURIComponent(tag.slug)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to delete tag");
      return;
    }

    await onSaved();
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            slug: {tag.slug}
          </div>

          <label className="mt-2 flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Название
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => void save()}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-white dark:bg-zinc-100 dark:text-black"
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={() => void del()}
            className="rounded-lg border px-3 py-2 text-zinc-900 dark:text-zinc-100"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

