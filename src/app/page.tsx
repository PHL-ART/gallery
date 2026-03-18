import Link from "next/link";
import prisma from "@/lib/prisma";
import { getPhotoUrl } from "@/lib/photoUrl";

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const latest = await prisma.photo.findMany({
    where: { isPublished: true },
    orderBy: { shotAt: "desc" },
    take: 6,
    include: { category: true },
  });

  const latestWithUrls = await Promise.all(
    latest.map(async (p) => ({
      ...p,
      imageUrl: await getPhotoUrl(p.s3Key),
    })),
  );

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="font-semibold">Моя фотогалерея</div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/latest"
              className="rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Последние
            </Link>
            <Link
              href="/browse"
              className="rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Каталог
            </Link>
            <Link
              href="/admin"
              className="rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">
              Подборки по рубрикам, тэгам и годам.
            </h1>
            <p className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
              Чистый минимализм, чтобы фотографии были главным.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/latest"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
              >
                Смотреть последние
              </Link>
              <Link
                href="/browse"
                className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Найти по рубрикам и тэгам
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-linear-to-b from-zinc-50 to-transparent p-6 dark:border-zinc-800 dark:from-zinc-900/40">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Навигация по рубрикам
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/c/${c.slug}`}
                  className="group rounded-xl border bg-white/70 p-4 transition hover:bg-white dark:border-zinc-800 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="text-lg font-semibold">{c.name}</div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Смотреть подборку
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Последние работы</h2>
            <Link
              href="/latest"
              className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            >
              Все →
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {latestWithUrls.map((p) => (
              <Link
                key={p.id}
                href={`/p/${p.slug}`}
                className="group overflow-hidden rounded-xl border bg-white dark:border-zinc-800"
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
                    {p.category ? ` · ${p.category.name}` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
