import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowlist = (process.env.ADMIN_ALLOWLIST ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase());
      const p = profile as { email?: string; login?: string };
      const email = p?.email?.toLowerCase() ?? "";
      const login = p?.login?.toLowerCase() ?? "";
      return allowlist.includes(email) || allowlist.includes(login);
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
};
