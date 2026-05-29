# SEO, OG Images & Analytics — Design Spec

**Date:** 2026-05-30  
**Status:** Approved

---

## Overview

Three independent features, all aimed at SEO and discoverability:

1. **OG Image generation** — `/api/og` route rendering photo-based previews
2. **Metadata enrichment** — `title`, `description`, `openGraph` on all public pages
3. **Analytics** — Google Analytics 4 + Yandex Metrika via `.env` flags

---

## Feature 1 — OG Image: `/api/og`

### Route

`src/app/api/og/route.tsx` — single GET handler, returns `ImageResponse` (1200×630).

### Query Parameters

| `type`    | `id`         | `label`                  | Data source        |
|-----------|--------------|--------------------------|--------------------|
| `photo`   | photo id     | —                        | `getPhoto(id)`     |
| `album`   | album id     | —                        | `getAlbum(id)`     |
| `tag`     | tag id       | —                        | `getTag(id)`       |
| `listing` | —            | `Albums\|Special\|Tags\|Latest` | none (static)      |

### Visual Template (approved in brainstorm)

```
┌──────────────────────────────────────────────┐
│  (20px top gap)                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │       PHOTO / COVER IMAGE            │    │
│  │       (object-fit: cover)            │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│  ─────────────────── 1px separator ──────── │
│  FILAT ASTAKHOV          ALBUM NAME / PHOTO  │  ← 110px bar
└──────────────────────────────────────────────┘
```

**Dimensions:** 1200×630  
**Background:** `#0a0a0a`  
**Photo area:** `position: absolute; top: 20px; left: 0; right: 0; bottom: 110px` — full width, no side padding  
**Bottom bar:** `height: 110px; padding: 0 20px` — flex row, items centered

**Typography:**
- Left — `FILAT ASTAKHOV`: Barlow Condensed 900, 48px, `#ffffff`, uppercase
- Right — content label:
  - `PHOTO` / `ALBUMS` / `SPECIAL` / `TAGS` / `LATEST`: Azeret Mono 700, 16px, `#555555`
  - Album name / Tag name: Azeret Mono 700, 17px, `#e63030`

### Implementation Details

**Image embedding:** fetch cover URL as `ArrayBuffer` → convert to base64 data URL → pass as `<img src="data:...">`. This avoids CORS/timeout issues with satori and remote S3 URLs.

**Font loading:** fetch Barlow Condensed 900 + Azeret Mono 700 from Google Fonts as `ArrayBuffer` on cold start. Store in module-level `let` variables so subsequent requests reuse cached buffers.

**Listing cover image:** for `type=listing`, fetch the most recent published photo via `prisma.photo.findFirst({ orderBy: { publishedAt: 'desc' } })` and use its `s3Key` as the background image.

**Fallback:** if no photo/cover is available (empty album, listing with no photos), render the bar on a plain `#0a0a0a` background without an image.

**Error handling:** if DB lookup fails or `id` is missing, return `Response` with 400 status (not `ImageResponse`).

**Example URLs:**
```
/api/og?type=photo&id=clx123
/api/og?type=album&id=clx456
/api/og?type=tag&id=clx789
/api/og?type=listing&label=Special
```

---

## Feature 2 — Metadata Enrichment

### `src/app/layout.tsx`

Add `metadataBase` so relative OG image URLs resolve correctly:
```ts
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photo.ph1l74.com'),
```

Root title/description stays: `"ph1l74 — Filat Astakhov"` / `"Street and documentary photography by Filat Astakhov"`.

### Dynamic pages

**`src/app/photo/[id]/page.tsx`**
```ts
title: "Photo — Filat Astakhov"
description: tags joined by ", " (e.g. "Street, Moscow, Night") — empty string if no tags
openGraph.images: [`/api/og?type=photo&id=${id}`]
```

**`src/app/(gallery)/albums/[id]/page.tsx`**
```ts
title: `${album.title} — Filat Astakhov`
description: `${album.photos.length} photos · ${album.title}`
openGraph.images: [`/api/og?type=album&id=${id}`]
```

**`src/app/(gallery)/tags/[id]/page.tsx`**
```ts
title: `#${tag.title} — Filat Astakhov`
description: `${tag.photos.length} photos tagged ${tag.title}`
openGraph.images: [`/api/og?type=tag&id=${id}`]
```

### Static listing pages

| Page | `title` | `description` | OG image |
|------|---------|---------------|----------|
| `/albums` | `Albums — Filat Astakhov` | `All photo albums by Filat Astakhov` | `/api/og?type=listing&label=Albums` |
| `/special` | `Special — Filat Astakhov` | `Curated special series by Filat Astakhov` | `/api/og?type=listing&label=Special` |
| `/latest` | `Latest — Filat Astakhov` | `Latest photos by Filat Astakhov` | `/api/og?type=listing&label=Latest` |
| `/tags` | `Tags — Filat Astakhov` | `Browse photos by tags` | `/api/og?type=listing&label=Tags` |

---

## Feature 3 — Analytics

### `.env` additions

```dotenv
# Google Analytics 4 Measurement ID (leave empty to disable)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Yandex Metrika counter ID (leave empty to disable)
NEXT_PUBLIC_YM_ID=XXXXXXXX
```

### `src/app/layout.tsx` additions

Use `next/script` with `strategy="afterInteractive"`. Scripts render only when the env var is set — safe to omit in dev.

**Google Analytics 4:**
```tsx
{gaId && (
  <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
    <Script id="ga-init" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `}</Script>
  </>
)}
```

**Yandex Metrika:**
```tsx
{ymId && (
  <>
    <Script id="ym-init" strategy="afterInteractive">{`
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,
      k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script",
      "https://mc.yandex.ru/metrika/tag.js","ym");
      ym(${ymId}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true});
    `}</Script>
    <noscript>
      <div><img src={`https://mc.yandex.ru/watch/${ymId}`} style={{position:'absolute',left:'-9999px'}} alt="" /></div>
    </noscript>
  </>
)}
```

---

## Files Touched

| File | Change |
|------|--------|
| `src/app/api/og/route.tsx` | **new** — OG image handler |
| `src/app/layout.tsx` | add `metadataBase`, GA4 + YM scripts |
| `src/app/photo/[id]/page.tsx` | enrich `generateMetadata` |
| `src/app/(gallery)/albums/[id]/page.tsx` | enrich `generateMetadata` |
| `src/app/(gallery)/tags/[id]/page.tsx` | enrich `generateMetadata` |
| `src/app/(gallery)/albums/page.tsx` | enrich static `metadata` |
| `src/app/(gallery)/special/page.tsx` | enrich static `metadata` |
| `src/app/(gallery)/latest/page.tsx` | enrich static `metadata` |
| `src/app/(gallery)/tags/page.tsx` | enrich static `metadata` |
| `.env` | add `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID` |

---

## Out of Scope

- `robots.txt` / `sitemap.xml` — отдельная задача
- Structured data (JSON-LD) — отдельная задача
- OG image for the root `/` page — root metadata already covers it via `layout.tsx`
