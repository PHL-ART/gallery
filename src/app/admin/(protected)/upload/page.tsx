"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

type FileStatus = "queued" | "uploading" | "processing" | "done" | "error";

type UploadItem = {
  localId: string;
  file: File;
  preview: string;
  status: FileStatus;
  progress: number;
  s3Key?: string;
  exifData?: Record<string, string>;
  shotAt?: string | null;
  error?: string;
};

type Album = { id: string; title: string; isSpecial: boolean };
type Tag = { id: string; title: string };

const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const STATUS_LABEL: Record<FileStatus, string> = {
  queued: "Queued",
  uploading: "Uploading",
  processing: "Reading EXIF",
  done: "Ready",
  error: "Error",
};

const STATUS_COLOR: Record<FileStatus, string> = {
  queued: "text-muted",
  uploading: "text-primary",
  processing: "text-primary",
  done: "text-[var(--red)]",
  error: "text-orange-400",
};

export default function AdminUploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/albums").then((r) => r.json()).then(setAlbums);
    fetch("/api/tags").then((r) => r.json()).then(setTags);
  }, []);

  const updateItem = useCallback((localId: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, ...patch } : item))
    );
  }, []);

  const processFile = useCallback(
    async (item: UploadItem) => {
      if (processingRef.current.has(item.localId)) return;
      processingRef.current.add(item.localId);

      try {
        updateItem(item.localId, { status: "uploading", progress: 0 });

        const { uploadUrl, s3Key } = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: item.file.name, contentType: item.file.type }),
        }).then((r) => r.json());

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", item.file.type);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              updateItem(item.localId, {
                progress: Math.round((e.loaded / e.total) * 90),
              });
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`S3 ${xhr.status}`));
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(item.file);
        });

        updateItem(item.localId, { status: "processing", progress: 95 });

        const fd = new FormData();
        fd.append("file", item.file);
        const { exifData, shotAt } = await fetch("/api/upload/exif", {
          method: "POST",
          body: fd,
        }).then((r) => r.json());

        updateItem(item.localId, { status: "done", progress: 100, s3Key, exifData, shotAt });
      } catch (e) {
        updateItem(item.localId, {
          status: "error",
          error: e instanceof Error ? e.message : "Failed",
        });
      }
    },
    [updateItem]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: UploadItem[] = acceptedFiles.map((file) => ({
        localId: makeId(),
        file,
        preview: URL.createObjectURL(file),
        status: "queued",
        progress: 0,
      }));
      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => processFile(item));
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".tiff"] },
    multiple: true,
  });

  function removeItem(localId: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.localId === localId);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.localId !== localId);
    });
    processingRef.current.delete(localId);
  }

  const doneItems = items.filter((i) => i.status === "done");

  async function publish() {
    setPublishing(true);
    let count = 0;
    for (const item of doneItems) {
      try {
        await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            s3Key: item.s3Key,
            shotAt: item.shotAt,
            exifData: item.exifData,
            albumIds: selectedAlbumIds,
            tagIds: selectedTagIds,
          }),
        });
        count++;
      } catch {
        updateItem(item.localId, { status: "error", error: "Failed to publish" });
      }
    }
    setItems([]);
    setSelectedAlbumIds([]);
    setSelectedTagIds([]);
    setPublishing(false);
    setPublishedCount(count);
    processingRef.current.clear();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Admin
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          Upload
        </h1>
      </div>

      {publishedCount > 0 && (
        <div className="mb-6 bg-panel px-5 py-4 font-mono text-sm text-[var(--red)]">
          ✓ {publishedCount} photo{publishedCount !== 1 ? "s" : ""} published
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-14 text-center cursor-pointer mb-8 transition-colors duration-150 ${
          isDragActive
            ? "border-[var(--red)] bg-panel-hi"
            : "border-[var(--surface-hi)] hover:border-[var(--text)] bg-panel"
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
          {isDragActive ? "Drop to upload" : "Drop photos here or click to select"}
        </p>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted mt-2 opacity-60">
          JPG · PNG · WEBP · TIFF
        </p>
      </div>

      {/* Upload queue */}
      {items.length > 0 && (
        <div className="mb-8">
          <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
            Queue — {items.length} file{items.length !== 1 ? "s" : ""},{" "}
            {doneItems.length} ready
          </span>
          <div className="space-y-px">
            {items.map((item) => (
              <div key={item.localId} className="bg-panel flex items-center gap-4 px-4 py-3">
                <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-panel-hi">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-primary truncate">{item.file.name}</div>
                  {item.status === "uploading" && (
                    <div className="mt-1.5 h-[2px] bg-panel-hi overflow-hidden">
                      <div
                        className="h-full bg-[var(--red)] transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.exifData && Object.keys(item.exifData).length > 0 && (
                    <div className="font-mono text-[0.55rem] text-muted mt-1 truncate">
                      {[
                        item.exifData.Make,
                        item.exifData.Model,
                        item.exifData.FNumber && `f/${item.exifData.FNumber}`,
                        item.exifData.ISO && `ISO ${item.exifData.ISO}`,
                        item.exifData.ExposureTime && `${item.exifData.ExposureTime}s`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  )}
                  {item.error && (
                    <div className="font-mono text-[0.55rem] text-orange-400 mt-1">
                      {item.error}
                    </div>
                  )}
                </div>
                <span
                  className={`font-mono text-[0.58rem] uppercase tracking-[0.1em] flex-shrink-0 ${STATUS_COLOR[item.status]}`}
                >
                  {item.status === "uploading"
                    ? `${item.progress}%`
                    : STATUS_LABEL[item.status]}
                </span>
                <button
                  onClick={() => removeItem(item.localId)}
                  aria-label="Remove"
                  className="text-muted hover:text-[var(--red)] font-mono text-xs transition-colors duration-150 ml-1 leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignment + publish */}
      {doneItems.length > 0 && (
        <div className="bg-panel p-6 mb-6">
          <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-5">
            Assign to
          </span>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <span className="block font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted mb-3">
                Albums
              </span>
              {albums.length === 0 && (
                <p className="font-mono text-xs text-muted">No albums yet</p>
              )}
              {albums.map((album) => (
                <label
                  key={album.id}
                  className="flex items-center gap-2 py-1 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlbumIds.includes(album.id)}
                    onChange={(e) =>
                      setSelectedAlbumIds((prev) =>
                        e.target.checked
                          ? [...prev, album.id]
                          : prev.filter((id) => id !== album.id)
                      )
                    }
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
            </div>
            <div>
              <span className="block font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted mb-3">
                Tags
              </span>
              {tags.length === 0 && (
                <p className="font-mono text-xs text-muted">No tags yet</p>
              )}
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 py-1 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={(e) =>
                      setSelectedTagIds((prev) =>
                        e.target.checked
                          ? [...prev, tag.id]
                          : prev.filter((id) => id !== tag.id)
                      )
                    }
                    className="accent-[var(--red)]"
                  />
                  <span className="font-mono text-xs text-primary group-hover:text-[var(--red)] transition-colors">
                    {tag.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={publish}
            disabled={publishing}
            className="bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-8 py-3 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing
              ? "Publishing…"
              : `Publish ${doneItems.length} photo${doneItems.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
