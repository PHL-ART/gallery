"use client";

import { useEffect, useMemo, useState } from "react";

type Category = { id: string; slug: string; name: string };
type Tag = { id: string; slug: string; name: string };

type Photo = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  shotAt: string;
  isPublished: boolean;
  s3Key: string;
  category: Category | null;
  tags: Array<{ tag: Tag }>;
};

export default function AdminPhotosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shotAt, setShotAt] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  async function loadAll() {
    const [cRes, tRes, pRes] = await Promise.all([
      fetch("/api/admin/categories", { credentials: "include" }),
      fetch("/api/admin/tags", { credentials: "include" }),
      fetch("/api/admin/photos", { credentials: "include" }),
    ]);

    const cData = (await cRes.json()) as { categories: Category[] };
    const tData = (await tRes.json()) as { tags: Tag[] };
    const pData = (await pRes.json()) as { photos: Photo[] };

    setCategories(cData.categories);
    setTags(tData.tags);
    setPhotos(pData.photos);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll();
  }, []);

  function toggleTag(id: string) {
    setTagIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  async function uploadNewPhoto() {
    if (!file) {
      alert("Выберите файл");
      return;
    }
    if (!title.trim() || !shotAt) {
      alert("Нужны `title` и `shotAt`");
      return;
    }

    const contentType = file.type || "application/octet-stream";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const s3Key = `photos/${Date.now()}-${safeName}`;

    // 1) Presign PUT
    const presignRes = await fetch("/api/s3/presign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "put",
        key: s3Key,
        contentType,
      }),
      credentials: "include",
    });

    if (!presignRes.ok) {
      const err = await presignRes.json().catch(() => ({}));
      alert(err?.error ?? "Failed to get presigned PUT URL");
      return;
    }

    const presign = (await presignRes.json()) as { url: string };

    // 2) Upload directly to S3
    const upRes = await fetch(presign.url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });

    if (!upRes.ok) {
      alert("S3 upload failed");
      return;
    }

    // 3) Create Photo record
    const shotAtIso = new Date(`${shotAt}T00:00:00.000Z`).toISOString();

    const createRes = await fetch("/api/admin/photos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description.trim() ? description : null,
        shotAt: shotAtIso,
        s3Key,
        isPublished,
        categoryId: categoryId ? categoryId : null,
        tagIds,
      }),
      credentials: "include",
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      alert(err?.error ?? "Failed to create photo");
      return;
    }

    // Reset form
    setFile(null);
    setTitle("");
    setDescription("");
    setShotAt("");
    setCategoryId("");
    setTagIds([]);
    setIsPublished(false);

    await loadAll();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Фото</h1>

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="font-medium">Загрузить</h2>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Файл</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
              }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Дата (shotAt)
            </span>
            <input
              type="date"
              value={shotAt}
              onChange={(e) => setShotAt(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Заголовок
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Описание (опционально)
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Рубрика (опционально)
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Опубликовано
            </span>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
          </label>

          <div className="sm:col-span-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Тэги
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tagIds.includes(t.id)}
                    onChange={() => toggleTag(t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!file || !title.trim() || !shotAt}
          onClick={() => void uploadNewPhoto()}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          Загрузить в галерею
        </button>
      </div>

      <div className="mt-10">
        <h2 className="font-medium">Список</h2>

        {loading ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Загрузка...
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {photos.map((p) => (
              <PhotoRow
                key={p.id}
                photo={p}
                categories={categories}
                tags={tags}
                onSaved={loadAll}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoRow({
  photo,
  categories,
  tags,
  onSaved,
}: {
  photo: Photo;
  categories: Category[];
  tags: Tag[];
  onSaved: () => Promise<void>;
}) {
  const initialTagIds = useMemo(
    () => photo.tags.map((pt) => pt.tag.id),
    [photo.tags],
  );

  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description ?? "");
  const [shotAt, setShotAt] = useState(() => {
    const d = new Date(photo.shotAt);
    // date input expects yyyy-mm-dd
    return d.toISOString().slice(0, 10);
  });
  const [categoryId, setCategoryId] = useState(photo.category?.id ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [isPublished, setIsPublished] = useState(photo.isPublished);

  function toggleSelectedTag(id: string) {
    setSelectedTagIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  async function save() {
    const shotAtIso = new Date(`${shotAt}T00:00:00.000Z`).toISOString();

    const res = await fetch(`/api/admin/photos/${photo.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description.trim() ? description : null,
        shotAt: shotAtIso,
        isPublished,
        categoryId: categoryId ? categoryId : null,
        tagIds: selectedTagIds,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to update photo");
      return;
    }

    await onSaved();
  }

  async function del() {
    if (!confirm(`Удалить фото "${photo.title}"?`)) return;

    const res = await fetch(`/api/admin/photos/${photo.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to delete photo");
      return;
    }

    await onSaved();
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            id: {photo.id}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Название
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                shotAt
              </span>
              <input
                type="date"
                value={shotAt}
                onChange={(e) => setShotAt(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>

            <label className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Описание
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20 rounded border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Рубрика
              </span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded border px-3 py-2"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                Опубликовано
              </span>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
            </label>
          </div>

          <div className="mt-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Тэги
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(t.id)}
                    onChange={() => toggleSelectedTag(t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>
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

