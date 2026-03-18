import { withAuth } from "next-auth/middleware";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const allowlist = (process.env.ADMIN_ALLOWLIST ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean)
  .map(normalizeEmail);

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      if (!token?.email) return false;
      if (allowlist.length === 0) return false;
      return allowlist.includes(normalizeEmail(token.email));
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/s3/presign"],
};

