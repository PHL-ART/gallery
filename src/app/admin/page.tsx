import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Админ-панель</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Управление рубриками, тегами и фотографиями.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/photos"
          className="rounded-lg border px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Фото
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Рубрики
        </Link>
        <Link
          href="/admin/tags"
          className="rounded-lg border px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Тэги
        </Link>
      </div>
    </div>
  );
}

