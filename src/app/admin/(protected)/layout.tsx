import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/shared/lib/auth";
import { AdminSidebar } from "@/shared/ui/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
