"use client";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="bg-panel p-10 w-full max-w-sm">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-6">
          Admin access
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em] mb-10"
          style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
        >
          ph<span style={{ color: "var(--red)" }}>1</span>l74
        </h1>
        <button
          onClick={() => signIn("github", { callbackUrl: "/admin" })}
          className="w-full bg-[var(--text)] text-[var(--bg)] font-mono text-xs font-bold uppercase tracking-[0.12em] px-6 py-3 hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150 focus-red"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
