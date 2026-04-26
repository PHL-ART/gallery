import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import exifr from "exifr";

const EXIF_TAGS = [
  "Make", "Model", "LensModel",
  "FNumber", "ExposureTime", "ISO",
  "FocalLength", "DateTimeOriginal",
];

/** Parses EXIF from a multipart file upload. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const raw = await exifr.parse(buffer, { pick: EXIF_TAGS });

    // Normalise to a flat string map for storage as Prisma Json
    const exifData: Record<string, string> = {};
    if (raw) {
      for (const [key, value] of Object.entries(raw)) {
        if (value !== null && value !== undefined) {
          exifData[key] = String(value);
        }
      }
    }

    // Extract shot date if available
    const shotAt = raw?.DateTimeOriginal
      ? new Date(raw.DateTimeOriginal as string).toISOString()
      : null;

    return NextResponse.json({ exifData, shotAt });
  } catch {
    return NextResponse.json({ error: "EXIF parsing failed" }, { status: 500 });
  }
}
