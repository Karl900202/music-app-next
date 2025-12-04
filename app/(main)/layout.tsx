// app/(main)/layout.tsx
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-screen relative">
      {/* Base dark background */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-neutral-950" />

      {/* Subtle top-left light gradient (around 5% of screen) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at 0% 0%,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.03) 7%,
              rgba(255, 255, 255, 0.00) 12%
            )
          `,
        }}
      />

      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-4 py-2">{children}</main>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
