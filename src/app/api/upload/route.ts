import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authOptions } from "@/shared/lib/auth";
import { getS3Client, S3_BUCKET } from "@/shared/lib/s3";
import { createId } from "@paralleldrive/cuid2";

/** Returns a presigned PUT URL for direct client → S3 upload. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 });
    }

    const ext = filename.split(".").pop() ?? "jpg";
    const s3Key = `photos/${createId()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 3600 });

    return NextResponse.json({ uploadUrl, s3Key });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
