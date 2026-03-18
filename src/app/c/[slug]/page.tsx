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
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });

  return {
    title: category?.name ? `Рубрика: ${category.name}` : "Рубрика",
    alternates: {
      canonical: `${siteUrl}/c/${params.slug}`,
    },
  };
}

export default async function CategoryPhotosPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  function clampPage(page: number) {
    if (!Number.isFinite(page) || page < 1) return 1;
    return Math.floor(page);
  }

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { id: true, slug: true, name: true },
  });

  if (!category) notFound();

  const page = clampPage(Number(searchParams?.page ?? 1));
  const limit = 24;
  const skip = (page - 1) * limit;

  const [total, photos] = await Promise.all([
    prisma.photo.count({ where: { isPublished: true, categoryId: category.id } }),
    prisma.photo.findMany({
      where: { isPublished: true, categoryId: category.id },
      orderBy: { shotAt: "desc" },
      skip,
      take: limit,
      include: { category: true },
    }),
  ]);

  const photosWithUrls = await Promise.all(
    photos.map(async (p) => ({ ...p, imageUrl: await getPhotoUrl(p.s3Key) })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {total} фотографий.
          </p>
        </div>
        <Link
          href="/browse"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Каталог →
        </Link>
      </div>

      {photosWithUrls.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-600 dark:text-zinc-400">
          Пусто.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photosWithUrls.map((p) => (
            <Link
              key={p.id}
              href={`/p/${p.slug}`}
              className="group overflow-hidden rounded-xl border bg-white dark:border-zinc-800 dark:bg-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
              <div className="p-4">
                <div className="font-medium">{p.title}</div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {new Date(p.shotAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center gap-4">
        {page > 1 ? (
          <Link
            href={`/c/${category.slug}?page=${page - 1}`}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Назад
          </Link>
        ) : (
          <span />
        )}

        {skip + photosWithUrls.length < total ? (
          <Link
            href={`/c/${category.slug}?page=${page + 1}`}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
          >
            Далее →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

