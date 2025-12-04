"use client";

import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled ? "backdrop-blur-sm bg-black/50 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-4 ">
        <div className="flex-1 flex justify-center">
          <div
            className={cn(
              "w-full max-w-2xl flex items-center gap-3 rounded-full px-3 py-2",
              "transition-shadow duration-150",
              q ? "shadow-[0_6px_18px_rgba(0,0,0,0.6)]" : "shadow-sm",
              "bg-gradient-to-r from-white/6 via-white/4 to-white/6"
            )}
          >
            <Search className="shrink-0 text-neutral-300" />
            <div className="relative w-full">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="노래, 아티스트, 앨범, 플레이리스트 검색"
                className="outline-none placeholder:text-neutral-400 text-white text-sm w-full bg-transparent pr-7"
              />

              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-m px-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-white/20 transition">
            <User className="text-neutral-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
