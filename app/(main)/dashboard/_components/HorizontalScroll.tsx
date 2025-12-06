"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

export default function HorizontalScroll({
  children,
  itemWidth = 225,
}: {
  children: React.ReactNode;
  itemWidth?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScrollEdges = () => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft <= 0;
    const right = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setCanLeft(!left);
    setCanRight(!right);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollEdges();
    el.addEventListener("scroll", checkScrollEdges);
    return () => el.removeEventListener("scroll", checkScrollEdges);
  }, [children]);

  return (
    <div className="relative w-full">
      {/* Scroll Buttons */}
      <div className="absolute -top-12 right-0 flex gap-3">
        <button
          disabled={!canLeft}
          className={`border border-white/30 p-2 rounded-full transition z-10 
            ${canLeft ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"}`}
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: -itemWidth,
              behavior: "smooth",
            })
          }
        >
          <ChevronLeft />
        </button>

        <button
          disabled={!canRight}
          className={`border border-white/30 p-2 rounded-full transition z-10 
            ${
              canRight ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"
            }`}
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: itemWidth,
              behavior: "smooth",
            })
          }
        >
          <ChevronRight />
        </button>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 py-3 overflow-x-scroll scroll-smooth no-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}
