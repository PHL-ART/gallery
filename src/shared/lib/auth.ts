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
      const email = (profile as { email?: string })?.email?.toLowerCase() ?? "";
      return allowlist.includes(email);
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
};
