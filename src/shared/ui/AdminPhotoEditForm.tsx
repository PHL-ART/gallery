"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminDeleteButton } from "./AdminDeleteButton";
import { LocationPicker } from "./LocationPicker";

interface Coords {
  lat: number;
  lon: number;
}

interface Props {
  photo: {
    id: string;
    s3Key: string;
    shotAt: string | null;
    albumIds: string[];
    tagIds: string[];
    exifData: Record<string, string> | null;
  };
  photoUrl: string;
  albums: { id: string; title: string; isSpecial: boolean }[];
  tags: { id: string; title: string }[];
}

export function AdminPhotoEditForm({ photo, photoUrl, albums, tags }: Props) {
  const router = useRouter();
  const [shotAt, setShotAt] = useState(photo.shotAt ? photo.shotAt.slice(0, 10) : "");
  const [albumIds, setAlbumIds] = useState<string[]>(photo.albumIds);
  const [tagIds, setTagIds] = useState<string[]>(photo.tagIds);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialGps: Coords | null =
    photo.exifData?.latitude && photo.exifData?.longitude
      ? {
          lat: parseFloat(photo.exifData.latitude),
          lon: parseFloat(photo.exifData.longitude),
        }
      : null;
  const [gps, setGps] = useState<Coords | null>(initialGps);
  const [pickerOpen, setPickerOpen] = useState(false);

  function toggleId(ids: string[], id: string, setter: (v: string[]) => void) {
    setter(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }

  async function handleSave() {
    setSaving(true);

    const updatedExifData: Record<string, string> = { ...(photo.exifData ?? {}) };
    if (gps) {
      updatedExifData.latitude = String(gps.lat);
      updatedExifData.longitude = String(gps.lon);
    } else {
      delete updatedExifData.latitude;
      delete updatedExifData.longitude;
    }

    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shotAt: shotAt || null,
        albumIds,
        tagIds,
        exifData: updatedExifData,
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
    <div className="space-y-6">
      <div className="bg-panel p-4 flex gap-6 items-start">
        <Image
          src={photoUrl}
          alt=""
          width={120}
          height={160}
          className="object-cover flex-shrink-0"
          style={{ width: 120, height: 160 }}
        />
        <div className="min-w-0">
          <div className="font-mono text-[0.55rem] text-muted uppercase tracking-[0.1em] mb-1">
            S3 Key
          </div>
          <div className="font-mono text-xs text-primary break-all">{photo.s3Key}</div>
          <div className="font-mono text-[0.55rem] text-muted uppercase tracking-[0.1em] mb-1 mt-4">
            ID
          </div>
          <div className="font-mono text-xs text-muted">{photo.id}</div>
        </div>
      </div>

      <div>
        <label className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Shot on
        </label>
        <input
          type="date"
          value={shotAt}
          onChange={(e) => setShotAt(e.target.value)}
          className={inputCls}
          style={border}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
            Location
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.1em] px-3 py-1.5 bg-panel-hi text-primary hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors duration-150"
            >
              {pickerOpen ? "Close map" : gps ? "Edit location" : "Set location"}
            </button>
            {gps && !pickerOpen && (
              <button
                type="button"
                onClick={() => setGps(null)}
                className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.1em] px-3 py-1.5 bg-panel-hi text-muted hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {gps && !pickerOpen && (
          <div className="font-mono text-[0.65rem] text-muted" style={border}>
            <span className="px-3 py-2 block">
              {gps.lat.toFixed(5)}, {gps.lon.toFixed(5)}
            </span>
          </div>
        )}
        {!gps && !pickerOpen && (
          <div className="font-mono text-[0.65rem] text-muted px-0">No location set</div>
        )}

        {pickerOpen && (
          <LocationPicker
            initial={gps ?? undefined}
            onConfirm={(coords) => {
              setGps(coords);
              setPickerOpen(false);
            }}
            onCancel={() => setPickerOpen(false)}
          />
        )}
      </div>

      <div>
        <label className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
          Albums
        </label>
        <div className="space-y-1">
          {albums.map((album) => (
            <label key={album.id} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={albumIds.includes(album.id)}
                onChange={() => toggleId(albumIds, album.id, setAlbumIds)}
                className="accent-[var(--red)]"
              />
              <span className="font-mono text-xs text-primary group-hover:text-[var(--red)] transition-colors">
                {album.title}
                {album.isSpecial && (
                  <span className="ml-1 text-muted text-[0.55rem]">special</span>
                )}
              </span>
            </label>
          ))}
          {albums.length === 0 && (
            <p className="font-mono text-xs text-muted">No albums yet</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
          Tags
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={tagIds.includes(tag.id)}
                onChange={() => toggleId(tagIds, tag.id, setTagIds)}
                className="accent-[var(--red)]"
              />
              <span className="font-mono text-xs text-primary group-hover:text-[var(--red)] transition-colors">
                {tag.title}
              </span>
            </label>
          ))}
          {tags.length === 0 && (
            <p className="font-mono text-xs text-muted">No tags yet</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
        </button>
        <AdminDeleteButton
          url={`/api/photos/${photo.id}`}
          label="Delete photo"
          redirectTo="/admin/photos"
        />
      </div>
    </div>
  );
}
