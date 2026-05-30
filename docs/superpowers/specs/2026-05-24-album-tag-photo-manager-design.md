# Photo Manager for Album/Tag Edit Pages

**Date:** 2026-05-24  
**Status:** Approved

## Goal

Add two photo-grid sections to the admin album and tag edit pages: one showing photos currently **in** the entity, one showing photos **not in** it. Clicking a photo toggles its membership. Changes are committed on the existing Save button.

---

## Architecture

**Approach:** Extend existing client-side edit forms (`AdminAlbumEditForm`, `AdminTagEditForm`) to manage photo assignments alongside their existing fields. A single Save request sends both field updates and the final `photoIds[]`.

---

## API Changes

### `GET /api/photos` — new query params

| Param | Description |
|---|---|
| `notInAlbumId` | Return only photos NOT in this album |
| `notInTagId` | Return only photos NOT in this tag |
| `skip` | Offset for pagination (default 0) |
| `take` | Page size (default 24) |

Response: `{ photos: [{ id, s3Key, url }], total: number }`  
`url` is computed server-side via `getPhotoUrl(s3Key)` so the client doesn't need S3 env vars.

Existing params (`albumId`, `tagId`) remain unchanged.

### `PUT /api/albums/[id]` — accept `photoIds?: string[]`

If `photoIds` is present in the body: delete all `PhotoAlbum` rows for this album and recreate them from the array. This is a replace-all sync, not a diff.

### `PUT /api/tags/[id]` — same with `photoIds?: string[]` and `PhotoTag`

---

## Server Pages

### `/admin/albums/[id]/page.tsx`

Additionally fetch photos in album:
```ts
prisma.photo.findMany({
  where: { albums: { some: { albumId: params.id } } },
  select: { id: true, s3Key: true },
  orderBy: { publishedAt: "desc" },
})
```
Compute `url` via `getPhotoUrl(s3Key)` and pass array as `photos` prop to `AdminAlbumEditForm`.

### `/admin/tags/[id]/page.tsx`

Same, filter by `tagId`.

---

## New Component: `PhotoManager`

`src/shared/ui/PhotoManager.tsx` — presentational client component

**Props:**
```ts
interface Props {
  inPhotos: PhotoThumb[]          // photos currently in entity
  notInPhotos: PhotoThumb[]       // paginated photos not in entity
  originalIds: Set<string>        // never mutates — used to compute "changed" state
  hasMore: boolean
  loadingMore: boolean
  onClickIn: (p: PhotoThumb) => void    // user clicked "in" photo → move out
  onClickNotIn: (p: PhotoThumb) => void // user clicked "not in" photo → move in
  onLoadMore: () => void
}
```

**PhotoThumb type:** `{ id: string; url: string }`

**Changed detection:** `isChanged(photo, isCurrentlyIn) = originalIds.has(photo.id) !== isCurrentlyIn`  
This automatically handles "undo" — if user toggles a photo twice it returns to clean state.

**Visual:**
- Grid: `grid-cols-6 gap-1`, each cell `aspect-[2/3]`
- Changed photo: `border-2 border-[var(--red)]`
- Unchanged: `border border-[var(--surface-hi)]`
- Image: `<img>` with `object-cover w-full h-full`
- "In" section header: `IN ALBUM — X photos — click to remove`
- "Not in" section header: `NOT IN ALBUM — click to add`
- Load More button: matches existing admin button style

---

## Refactored Edit Forms

### `AdminAlbumEditForm`

New props: `photos: PhotoThumb[]` (photos in album, server-provided)

New state:
```ts
const [inPhotos, setInPhotos] = useState(props.photos)
const [notInPhotos, setNotInPhotos] = useState<PhotoThumb[]>([])
const [skip, setSkip] = useState(0)
const [hasMore, setHasMore] = useState(true)
const [loadingMore, setLoadingMore] = useState(false)
const originalIds = useMemo(() => new Set(props.photos.map(p => p.id)), [])
```

**Initial load:** `useEffect` on mount fetches first 24 "not in album" photos via `GET /api/photos?notInAlbumId=<id>&skip=0&take=24`.

**Toggle logic:**
- Click "in" photo: remove from `inPhotos`, prepend to `notInPhotos`
- Click "not in" photo: remove from `notInPhotos`, prepend to `inPhotos`

**Load more:** fetch next page `skip += 24`, append to `notInPhotos`.

**Save:** `PUT /api/albums/[id]` body includes `{ title, description, isSpecial, photoIds: inPhotos.map(p => p.id) }`.

Layout: existing form fields → Save button → divider → `PhotoManager`

### `AdminTagEditForm`

Identical pattern, `notInTagId` param, sends `{ title, description, photoIds }`.

---

## Constraints & Scope

- "In" section: all loaded eagerly (server-side, no pagination needed — albums/tags typically have ≤200 photos).
- "Not in" section: 24 per page, offset-based, "Load more" button (no infinite scroll).
- No search or filter in grids.
- Max-width stays `max-w-2xl` — the grids fit within this.
- GPS editing on photos is already implemented in `AdminPhotoEditForm` and is unrelated to this feature.

---

## Files Modified

| File | Change |
|---|---|
| `src/app/api/photos/route.ts` | Add `notInAlbumId`, `notInTagId`, `skip`, `take` params; return `{ photos, total }` with `url` |
| `src/app/api/albums/[id]/route.ts` | Handle `photoIds` in PUT |
| `src/app/api/tags/[id]/route.ts` | Handle `photoIds` in PUT |
| `src/app/admin/(protected)/albums/[id]/page.tsx` | Fetch in-album photos, pass to form |
| `src/app/admin/(protected)/tags/[id]/page.tsx` | Fetch in-tag photos, pass to form |
| `src/shared/ui/AdminAlbumEditForm.tsx` | Add photo management state + PhotoManager |
| `src/shared/ui/AdminTagEditForm.tsx` | Add photo management state + PhotoManager |
| `src/shared/ui/PhotoManager.tsx` | **New** — presentational grid component |
