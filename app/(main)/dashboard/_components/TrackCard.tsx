"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Track } from "../page";

export default function TrackCard({ track }: { track: Track }) {
  const image = track.image?.[2]?.["#text"] || "/placeholder.png";

  return (
    <div className="group relative min-w-[210px] bg-neutral-900 rounded-xl p-3 flex flex-col gap-3 shadow-lg cursor-pointer overflow-hidden">
      {/* Image wrapper */}
      <div className="relative">
        <Image
          width={210}
          height={210}
          src={image}
          alt={track.name}
          className="rounded-lg transition duration-200 group-hover:brightness-75"
        />

        {/* Play Button */}
        <button
          className="
            absolute inset-0 m-auto w-12 h-12 rounded-full bg-white text-black 
            flex items-center justify-center opacity-0 translate-y-2 
            group-hover:opacity-100 group-hover:translate-y-0 
            transition duration-200 shadow-xl
          "
        >
          <Play size={20} className="ml-1" />
        </button>
      </div>

      <p className="text-white font-semibold text-sm truncate">{track.name}</p>
      <p className="text-neutral-400 text-xs truncate">{track.artist?.name}</p>
    </div>
  );
}
