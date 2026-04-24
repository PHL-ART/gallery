"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted hover-primary active-accent no-underline transition-colors duration-150 focus-red"
    >
      {children}
    </Link>
  );
}
