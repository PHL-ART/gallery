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
      // Only the owner's GitHub account may sign in
      return String((profile as { id?: number })?.id) === process.env.ADMIN_GITHUB_ID;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
};
