"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { House, Bookmark, Compass, Plus, Pin, CirclePlay } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "홈", path: "/dashboard", icon: House },
    { name: "둘러보기", path: "/explore", icon: Compass },
    { name: "보관함", path: "/library", icon: Bookmark },
  ];

  return (
    <aside className="w-60 h-full bg-black/30 border-r border-white/10 p-4 flex flex-col backdrop-blur-md">
      <div className="flex items-center justify-center gap-2 mt-3 mb-10 px-2">
        <div className="w-12 h-7 rounded-xl bg-white flex items-center justify-center">
          <span className="text-purple-600 font-bold text-m">Karl</span>
        </div>
        <span className="text-lg font-semibold text-white">Music</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-5 px-2 py-2 rounded-lg transition",
              pathname === item.path
                ? "bg-white/10 text-white"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon></item.icon>
            <p className="text-xl font-bold py-1">{item.name}</p>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-b border-white/10 my-4" />

      {/* New Playlist Button */}
      <button className="mt-6 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-m text-neutral-200 text-center">
        <div className="flex items-center justify-center gap-1">
          <Plus></Plus> 새 재생목록
        </div>
      </button>

      <div className="group relative flex flex-col gap-2 text-neutral-400 rounded-lg hover:bg-white/15 text-sm px-4 py-2 mt-10">
        <span className="font-semibold text-neutral-300">
          좋아요 표시한 음악
        </span>

        <div className="flex items-center gap-1 text-xs">
          <Pin size={12} className="rotate-[35deg]" />
          자동 재생목록
        </div>

        {/* Hover 시 나타나는 아이콘 */}
        <CirclePlay
          size={28}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            text-white cursor-pointer
          "
        />
      </div>
    </aside>
  );
}
