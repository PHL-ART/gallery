"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/upload", label: "Upload", exact: false },
  { href: "/admin/photos", label: "Photos", exact: false },
  { href: "/admin/albums", label: "Albums", exact: false },
  { href: "/admin/tags", label: "Tags", exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[220px] flex-shrink-0 bg-panel flex flex-col min-h-screen sticky top-0 self-start"
      style={{ borderRight: "1px solid var(--surface-hi)" }}
    >
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--surface-hi)" }}>
        <Link href="/" className="font-mono text-sm font-bold no-underline text-primary">
          ph<span style={{ color: "var(--red)" }}>1</span>l74
          <span className="text-muted ml-2 text-xs font-normal">admin</span>
        </Link>
      </div>

      <nav className="flex-1 py-3">
        {NAV.map(({ href, label, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] no-underline transition-colors duration-150 ${
                active
                  ? "text-[var(--red)] bg-panel-hi"
                  : "text-muted hover:text-primary hover:bg-panel-hi"
              }`}
            >
              <span
                className="w-[4px] h-[4px] flex-shrink-0 transition-colors duration-150"
                style={{ background: active ? "var(--red)" : "transparent" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: "1px solid var(--surface-hi)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full text-left font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted hover:text-[var(--red)] transition-colors duration-150 py-1.5 px-2 focus-red"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
