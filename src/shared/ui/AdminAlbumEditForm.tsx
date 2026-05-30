"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PhotoManager, PhotoThumb } from "./PhotoManager";

interface Props {
  album: {
    id: string;
    title: string;
    description: string;
    isSpecial: boolean;
  };
  photos: PhotoThumb[];
}

const PAGE_SIZE = 24;

export function AdminAlbumEditForm({ album, photos: initialPhotos }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description);
  const [isSpecial, setIsSpecial] = useState(album.isSpecial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [inPhotos, setInPhotos] = useState<PhotoThumb[]>(initialPhotos);
  const [notInPhotos, setNotInPhotos] = useState<PhotoThumb[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const originalIds = useMemo(
    () => new Set(initialPhotos.map((p) => p.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchNotIn = useCallback(
    async (currentSkip: number, currentInPhotos: PhotoThumb[]) => {
      setLoadingMore(true);
      const res = await fetch(
        `/api/photos?notInAlbumId=${album.id}&skip=${currentSkip}&take=${PAGE_SIZE}`
      );
      const data: { photos: PhotoThumb[]; total: number } = await res.json();
      const inIds = new Set(currentInPhotos.map((p) => p.id));
      const fresh = data.photos.filter((p) => !inIds.has(p.id));
      setNotInPhotos((prev) => (currentSkip === 0 ? fresh : [...prev, ...fresh]));
      setHasMore(currentSkip + PAGE_SIZE < data.total);
      setLoadingMore(false);
    },
    [album.id]
  );

  useEffect(() => {
    fetchNotIn(0, inPhotos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickIn(photo: PhotoThumb) {
    setInPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setNotInPhotos((prev) => [photo, ...prev]);
  }

  function handleClickNotIn(photo: PhotoThumb) {
    setNotInPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setInPhotos((prev) => [photo, ...prev]);
  }

  async function handleLoadMore() {
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    await fetchNotIn(nextSkip, inPhotos);
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/albums/${album.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        isSpecial,
        photoIds: inPhotos.map((p) => p.id),
      }),
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
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isSpecial}
          onChange={(e) => setIsSpecial(e.target.checked)}
          className="accent-[var(--red)]"
        />
        <span className="font-mono text-xs text-muted">Special (curated series)</span>
      </label>
      <button
        onClick={handleSave}
        disabled={saving || !title.trim()}
        className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40"
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
      </button>

      <PhotoManager
        inPhotos={inPhotos}
        notInPhotos={notInPhotos}
        originalIds={originalIds}
        hasMore={hasMore}
        loadingMore={loadingMore}
        inLabel="in album"
        onClickIn={handleClickIn}
        onClickNotIn={handleClickNotIn}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
