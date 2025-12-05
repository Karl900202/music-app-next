"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Track } from "./page";

const JENRE = ["ROCK", "BALLAD", "DANCE", "JAZZ", "POP", "K-POP", "SOUL"];
export default function TrendingTracksClient({ tracks }: { tracks: Track[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [moveX] = useState(225);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 스크롤 가능 여부 체크 함수
  const checkScrollEdges = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isAtLeft = el.scrollLeft <= 0;
    const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setCanScrollLeft(!isAtLeft);
    setCanScrollRight(!isAtRight);
  };

  // mount 후 초기 체크 + 스크롤 이벤트 등록
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollEdges(); // 초기 상태 계산
    el.addEventListener("scroll", checkScrollEdges);

    return () => el.removeEventListener("scroll", checkScrollEdges);
  }, []);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-start gap-4 mb-10">
        {JENRE.map((jenre) => {
          return (
            <div
              key={jenre}
              className="rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm p-2"
            >
              {jenre}
            </div>
          );
        })}
      </div>
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">인기 급 상승곡</h1>

        <div className="ml-auto space-x-4 flex items-center">
          {/* LEFT */}
          <button
            disabled={!canScrollLeft}
            className={`z-10 border border-white/30 p-2 rounded-full cursor-pointer transition 
              ${
                canScrollLeft
                  ? "hover:bg-white/10"
                  : "opacity-30 cursor-not-allowed"
              }`}
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -moveX, behavior: "smooth" })
            }
          >
            <ChevronLeft></ChevronLeft>
          </button>

          {/* RIGHT */}
          <button
            disabled={!canScrollRight}
            className={`z-10 border border-white/30 p-2 rounded-full cursor-pointer transition 
              ${
                canScrollRight
                  ? "hover:bg-white/10"
                  : "opacity-30 cursor-not-allowed"
              }`}
            onClick={() =>
              scrollRef.current?.scrollBy({ left: moveX, behavior: "smooth" })
            }
          >
            <ChevronRight></ChevronRight>
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <div
          ref={scrollRef}
          className="flex gap-4 py-2 overflow-x-scroll scroll-smooth no-scrollbar hover-scrollbar"
        >
          {tracks.map((track, i) => (
            <div
              key={i}
              className="min-w-[210px] bg-neutral-900 rounded-xl py-3 flex flex-col gap-3 shadow-lg"
            >
              <Image
                width={210}
                height={210}
                src={track.image?.[2]?.["#text"] || "/placeholder.png"}
                alt={track.name}
                className="rounded-lg"
              />

              <p className="text-white font-semibold text-sm truncate">
                {track.name}
              </p>

              <p className="text-neutral-400 text-xs truncate">
                {track.artist?.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
