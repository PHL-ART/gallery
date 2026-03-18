import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSiteUrl } from "@/lib/siteUrl";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  return {
    title: "Каталог",
    alternates: { canonical: `${siteUrl}/browse` },
  };
}

export default async function BrowsePage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: {
          select: {
            photos: { where: { isPublished: true } },
          },
        },
      },
    }),
    prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: {
          select: {
            photos: { where: { photo: { isPublished: true } } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Каталог</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Рубрики и тэги — чтобы быстро найти нужное.
          </p>
        </div>
        <Link
          href="/latest"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Последние →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Рубрики</h2>
          <div className="mt-4 space-y-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/c/${c.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {c._count.photos}
                </span>
              </Link>
            ))}
            {categories.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Нет рубрик.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Тэги</h2>
          <div className="mt-4 space-y-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/t/${t.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t._count.photos}
                </span>
              </Link>
            ))}
            {tags.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Нет тэгов.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

