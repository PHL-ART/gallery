"use client";

export interface PhotoThumb {
  id: string;
  url: string;
}

interface Props {
  inPhotos: PhotoThumb[];
  notInPhotos: PhotoThumb[];
  originalIds: Set<string>;
  hasMore: boolean;
  loadingMore: boolean;
  inLabel: string;   // e.g. "in album" or "in tag"
  onClickIn: (photo: PhotoThumb) => void;
  onClickNotIn: (photo: PhotoThumb) => void;
  onLoadMore: () => void;
}

function isChanged(photo: PhotoThumb, isCurrentlyIn: boolean, originalIds: Set<string>): boolean {
  return originalIds.has(photo.id) !== isCurrentlyIn;
}

function PhotoCell({
  photo,
  currentlyIn,
  originalIds,
  onClick,
}: {
  photo: PhotoThumb;
  currentlyIn: boolean;
  originalIds: Set<string>;
  onClick: () => void;
}) {
  const changed = isChanged(photo, currentlyIn, originalIds);
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden"
      style={{
        aspectRatio: "2/3",
        border: changed ? "2px solid var(--red)" : "1px solid var(--surface-hi)",
      }}
    >
      <img
        src={photo.url}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {changed && (
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ background: "var(--red)" }}
        />
      )}
    </div>
  );
}

export function PhotoManager({
  inPhotos,
  notInPhotos,
  originalIds,
  hasMore,
  loadingMore,
  inLabel,
  onClickIn,
  onClickNotIn,
  onLoadMore,
}: Props) {
  const labelCls =
    "font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2 block";

  return (
    <div className="space-y-6 pt-6" style={{ borderTop: "1px solid var(--surface-hi)" }}>
      {/* In entity */}
      <div>
        <span className={labelCls}>
          {inLabel} — {inPhotos.length} photo{inPhotos.length !== 1 ? "s" : ""} — click to remove
        </span>
        {inPhotos.length === 0 ? (
          <p className="font-mono text-xs text-muted">No photos</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
            {inPhotos.map((photo) => (
              <PhotoCell
                key={photo.id}
                photo={photo}
                currentlyIn={true}
                originalIds={originalIds}
                onClick={() => onClickIn(photo)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Not in entity */}
      <div>
        <span className={labelCls}>
          not {inLabel} — click to add
        </span>
        {notInPhotos.length === 0 && !loadingMore ? (
          <p className="font-mono text-xs text-muted">No other photos</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
            {notInPhotos.map((photo) => (
              <PhotoCell
                key={photo.id}
                photo={photo}
                currentlyIn={false}
                originalIds={originalIds}
                onClick={() => onClickNotIn(photo)}
              />
            ))}
          </div>
        )}
        {(hasMore || loadingMore) && (
          <div className="mt-3">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-panel-hi text-primary hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors duration-150 disabled:opacity-40"
            >
              {loadingMore ? "Loading…" : "Load more…"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
