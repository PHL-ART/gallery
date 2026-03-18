"use client";

import { useEffect, useState } from "react";

type Category = {
  slug: string;
  name: string;
  description: string | null;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories", { credentials: "include" });
    const data = (await res.json()) as { categories: Category[] };
    setCategories(data.categories);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function createCategory() {
    const payload = {
      name,
      description: description.trim() ? description : null,
      slug: slug.trim() ? slug : undefined,
    };

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to create category");
      return;
    }

    setName("");
    setDescription("");
    setSlug("");
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Рубрики</h1>

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

          <label className="sm:col-span-2 flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Описание (опционально)
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 rounded border px-3 py-2"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => void createCategory()}
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
            {categories.map((c) => (
              <CategoryRow key={c.slug} category={c} onSaved={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  onSaved,
}: {
  category: Category;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");

  async function save() {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(category.slug)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        description: description.trim() ? description : null,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to update category");
      return;
    }

    await onSaved();
  }

  async function del() {
    if (!confirm(`Удалить рубрику "${category.name}"?`)) return;

    const res = await fetch(
      `/api/admin/categories/${encodeURIComponent(category.slug)}`,
      { method: "DELETE", credentials: "include" },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to delete category");
      return;
    }

    await onSaved();
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            slug: {category.slug}
          </div>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 sm:col-span-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Название
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Описание
              </span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>
          </div>
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

