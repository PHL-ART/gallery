import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";

export const runtime = "nodejs";

// Module-level font cache — loaded once per cold start
let fontBarlow: ArrayBuffer | null = null;
let fontAzeret: ArrayBuffer | null = null;

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: `${family}:wght@${weight}`, display: "swap" });
  const css = await fetch(`https://fonts.googleapis.com/css2?${params}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  }).then((r) => r.text());

  const match = css.match(/src: url\((.+?)\) format\('woff2'\)/);
  if (!match) throw new Error(`Font not found: ${family} ${weight}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

async function getFonts() {
  if (!fontBarlow) fontBarlow = await loadGoogleFont("Barlow Condensed", 900);
  if (!fontAzeret) fontAzeret = await loadGoogleFont("Azeret Mono", 700);
  return { barlow: fontBarlow, azeret: fontAzeret };
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return null;
  }
}

function OgImage({
  imageDataUrl,
  label,
  accent,
}: {
  imageDataUrl: string | null;
  label: string;
  accent: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* 20px top gap */}
      <div style={{ height: 20, display: "flex" }} />

      {/* Photo area — fills remaining space above the bar */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#111" }} />
        )}
      </div>

      {/* 1px separator */}
      <div style={{ height: 1, backgroundColor: "#1c1c1c", display: "flex" }} />

      {/* Bottom bar: 110px */}
      <div
        style={{
          height: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <span
          style={{
            fontFamily: "Barlow Condensed",
            fontWeight: 900,
            fontSize: 48,
            color: "#ffffff",
            lineHeight: 1,
            display: "flex",
          }}
        >
          FILAT ASTAKHOV
        </span>
        <span
          style={{
            fontFamily: "Azeret Mono",
            fontWeight: 700,
            fontSize: accent ? 17 : 16,
            color: accent ? "#e63030" : "#555555",
            letterSpacing: accent ? "3px" : "4px",
            display: "flex",
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    const fonts = await getFonts();

    let imageUrl: string | null = null;
    let label = "Gallery";
    let accent = false;

    if (type === "photo") {
      if (!id) return new Response("Missing id", { status: 400 });
      const photo = await prisma.photo.findUnique({
        where: { id },
        select: { s3Key: true },
      });
      if (!photo) return new Response("Not found", { status: 404 });
      imageUrl = getPhotoUrl(photo.s3Key);
      label = "Photo";

    } else if (type === "album") {
      if (!id) return new Response("Missing id", { status: 400 });
      const album = await prisma.album.findUnique({
        where: { id },
        select: {
          title: true,
          photos: {
            take: 1,
            orderBy: { photo: { publishedAt: "desc" } },
            select: { photo: { select: { s3Key: true } } },
          },
        },
      });
      if (!album) return new Response("Not found", { status: 404 });
      imageUrl = album.photos[0] ? getPhotoUrl(album.photos[0].photo.s3Key) : null;
      label = album.title;
      accent = true;

    } else if (type === "tag") {
      if (!id) return new Response("Missing id", { status: 400 });
      const tag = await prisma.tag.findUnique({
        where: { id },
        select: {
          title: true,
          photos: {
            take: 1,
            orderBy: { photo: { publishedAt: "desc" } },
            select: { photo: { select: { s3Key: true } } },
          },
        },
      });
      if (!tag) return new Response("Not found", { status: 404 });
      imageUrl = tag.photos[0] ? getPhotoUrl(tag.photos[0].photo.s3Key) : null;
      label = tag.title;
      accent = true;

    } else if (type === "listing") {
      const latest = await prisma.photo.findFirst({
        orderBy: { publishedAt: "desc" },
        select: { s3Key: true },
      });
      imageUrl = latest ? getPhotoUrl(latest.s3Key) : null;
      label = searchParams.get("label") ?? "Gallery";

    } else {
      return new Response("Invalid type", { status: 400 });
    }

    const imageDataUrl = imageUrl ? await fetchImageAsDataUrl(imageUrl) : null;

    return new ImageResponse(
      <OgImage imageDataUrl={imageDataUrl} label={label} accent={accent} />,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Barlow Condensed", data: fonts.barlow, weight: 900, style: "normal" },
          { name: "Azeret Mono", data: fonts.azeret, weight: 700, style: "normal" },
        ],
      }
    );
  } catch (err) {
    console.error("[OG]", err);
    return new Response("Internal error", { status: 500 });
  }
}
