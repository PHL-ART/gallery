import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPhotoUrl } from "@/lib/photoUrl";
import { getSiteUrl } from "@/lib/siteUrl";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();

  const photo = await prisma.photo.findUnique({
    where: { slug: params.slug },
    select: {
      slug: true,
      title: true,
      description: true,
      shotAt: true,
      isPublished: true,
      s3Key: true,
    },
  });

  if (!photo || !photo.isPublished) {
    return {
      title: "Фото не найдено",
      alternates: { canonical: `${siteUrl}/p/${params.slug}` },
    };
  }

  const imageUrl = await getPhotoUrl(photo.s3Key);

  return {
    title: photo.title,
    description: photo.description ?? undefined,
    alternates: {
      canonical: `${siteUrl}/p/${photo.slug}`,
    },
    openGraph: {
      title: photo.title,
      description: photo.description ?? undefined,
      url: `${siteUrl}/p/${photo.slug}`,
      images: [{ url: imageUrl, alt: photo.title }],
      type: "website",
    },
  };
}

export default async function PhotoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const photo = await prisma.photo.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      location: true,
      tags: { include: { tag: true } },
    },
  });

  if (!photo || !photo.isPublished) notFound();

  const imageUrl = await getPhotoUrl(photo.s3Key);

  const similar = await prisma.photo.findMany({
    where: {
      isPublished: true,
      categoryId: photo.categoryId ?? undefined,
      NOT: { id: photo.id },
    },
    orderBy: { shotAt: "desc" },
    take: 6,
  });

  const similarWithUrls = await Promise.all(
    similar.map(async (p) => ({
      ...p,
      imageUrl: await getPhotoUrl(p.s3Key),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/latest" className="hover:underline">
            Последние
          </Link>
          {photo.category ? (
            <>
              {" "}
              /{" "}
              <Link href={`/c/${photo.category.slug}`} className="hover:underline">
                {photo.category.name}
              </Link>
            </>
          ) : null}
        </div>
        <Link
          href="/browse"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Каталог →
        </Link>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={photo.title}
            className="w-full rounded-2xl border bg-black object-contain"
            loading="eager"
            decoding="async"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            {photo.title}
          </h1>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {new Date(photo.shotAt).toLocaleDateString("ru-RU")}
          </div>

          {photo.description ? (
            <p className="mt-4 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
              {photo.description}
            </p>
          ) : null}

          <div className="mt-6 space-y-3 text-sm">
            {photo.category ? (
              <div>
                <div className="text-zinc-500 dark:text-zinc-400">Рубрика</div>
                <Link
                  href={`/c/${photo.category.slug}`}
                  className="font-medium hover:underline"
                >
                  {photo.category.name}
                </Link>
              </div>
            ) : null}

            {photo.location ? (
              <div>
                <div className="text-zinc-500 dark:text-zinc-400">Локация</div>
                <div className="font-medium">{photo.location.name}</div>
              </div>
            ) : null}

            {photo.tags.length ? (
              <div>
                <div className="text-zinc-500 dark:text-zinc-400">Тэги</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {photo.tags.map((pt) => (
                    <Link
                      key={pt.tag.id}
                      href={`/t/${pt.tag.slug}`}
                      className="rounded-full border px-3 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                      {pt.tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <details className="mt-6 rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">Доп. инфо</summary>
            <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-200">
              {photo.exifJson ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(photo.exifJson, null, 2)}
                </pre>
              ) : (
                <p>EXIF и геоданные пока не загружены/не сохранены.</p>
              )}
            </div>
          </details>
        </div>
      </div>

      {similarWithUrls.length ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Похожие</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {similarWithUrls.map((p) => (
              <Link
                key={p.id}
                href={`/p/${p.slug}`}
                className="group overflow-hidden rounded-xl border bg-white dark:border-zinc-800 dark:bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-4">
                  <div className="font-medium">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

