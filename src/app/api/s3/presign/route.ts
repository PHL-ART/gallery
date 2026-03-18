import { getPresignedGetUrl, getPresignedPutUrl } from "@/lib/s3";

type PresignRequest =
  | {
      type: "put";
      key: string;
      contentType: string;
      expiresInSeconds?: number;
    }
  | {
      type: "get";
      key: string;
      expiresInSeconds?: number;
    };

export async function POST(req: Request) {
  const body = (await req.json()) as PresignRequest;

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (body.type === "put") {
    if (!body.contentType) {
      return Response.json(
        { error: "`contentType` is required for put presign" },
        { status: 400 },
      );
    }

    const res = await getPresignedPutUrl({
      key: body.key,
      contentType: body.contentType,
      expiresInSeconds: body.expiresInSeconds,
    });

    return Response.json(res);
  }

  const res = await getPresignedGetUrl({
    key: body.key,
    expiresInSeconds: body.expiresInSeconds,
  });

  return Response.json(res);
}

