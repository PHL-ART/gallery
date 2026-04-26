import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
