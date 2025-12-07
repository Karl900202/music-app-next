// app/(main)/layout.tsx
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { PlayerProvider } from "./dashboard/_components/PlayerContext";
import PlayerBar from "./dashboard/_components/PlayerBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      <div className="min-h-screen min-w-screen relative">
        <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" />

        <div className="flex h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* YouTube Music style gradient - sky blue, only on main content area */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(
                    180deg,
                    rgba(59, 130, 246, 0.12) 0%,
                    rgba(59, 130, 246, 0.08) 20%,
                    rgba(59, 130, 246, 0.04) 40%,
                    rgba(59, 130, 246, 0.02) 60%,
                    rgba(59, 130, 246, 0.01) 80%,
                    transparent 100%
                  )
                `,
              }}
            />

            <Header />
            <main className="flex-1 overflow-y-auto relative z-10 pb-20">
              {children}
            </main>
          </div>
        </div>

        <PlayerBar />
        <Toaster position="bottom-center" />
      </div>
    </PlayerProvider>
  );
}
