import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";
import { AdminDeleteButton } from "@/shared/ui/AdminDeleteButton";
import { AdminCreateTagForm } from "@/shared/ui/AdminCreateTagForm";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { photos: true } } },
  });

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Admin
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          Tags
        </h1>
      </div>

      <div className="bg-panel p-6 mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-4">
          New tag
        </span>
        <AdminCreateTagForm />
      </div>

      <div className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted mb-3">
        {tags.length} tag{tags.length !== 1 ? "s" : ""}
      </div>

      <div className="space-y-px">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-panel flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs text-primary">{tag.title}</div>
              <div className="font-mono text-[0.55rem] text-muted mt-0.5">
                {tag._count.photos} photo{tag._count.photos !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/tags/${tag.id}`}
                className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted hover:text-primary no-underline transition-colors"
              >
                Edit
              </Link>
              <AdminDeleteButton url={`/api/tags/${tag.id}`} />
            </div>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="font-mono text-xs text-muted py-8 text-center">
            No tags yet
          </p>
        )}
      </div>
    </div>
  );
}
