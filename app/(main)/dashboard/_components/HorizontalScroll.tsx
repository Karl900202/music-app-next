"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface HorizontalScrollRef {
  scrollToStart: () => void;
}

const HorizontalScroll = forwardRef<
  HorizontalScrollRef,
  {
    children: React.ReactNode;
    itemWidth?: number;
  }
>(({ children, itemWidth = 226 }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScrollEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft <= 0;
    const right = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setCanLeft(!left);
    setCanRight(!right);
  }, []);

  const scrollByVisibleCards = useCallback(
    (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;

      const containerWidth = el.clientWidth;
      const cardWidth = itemWidth;
      const visibleCards = Math.floor(containerWidth / cardWidth) || 1;
      const scrollAmount = visibleCards * cardWidth;

      let newScrollLeft =
        direction === "left"
          ? el.scrollLeft - scrollAmount
          : el.scrollLeft + scrollAmount;

      const maxScroll = el.scrollWidth - el.clientWidth;
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));

      const cardIndex = Math.round(newScrollLeft / cardWidth);
      newScrollLeft = cardIndex * cardWidth;

      el.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    },
    [itemWidth]
  );

  const scrollToStart = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      scrollToStart,
    }),
    [scrollToStart]
  );

  const handleScrollLeft = useCallback(() => {
    scrollByVisibleCards("left");
  }, [scrollByVisibleCards]);

  const handleScrollRight = useCallback(() => {
    scrollByVisibleCards("right");
  }, [scrollByVisibleCards]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollEdges();
    el.addEventListener("scroll", checkScrollEdges);
    return () => el.removeEventListener("scroll", checkScrollEdges);
  }, [children, checkScrollEdges]);

  return (
    <div className="relative w-9/10">
      <div className="absolute -top-12 right-0 flex gap-3">
        <button
          disabled={!canLeft}
          className={`border border-white/30 p-2 rounded-full transition z-10 
            ${canLeft ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"}`}
          onClick={handleScrollLeft}
        >
          <ChevronLeft />
        </button>

        <button
          disabled={!canRight}
          className={`border border-white/30 p-2 rounded-full transition z-10 
            ${
              canRight ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"
            }`}
          onClick={handleScrollRight}
        >
          <ChevronRight />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 py-3 overflow-x-scroll scroll-smooth hover-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
});

HorizontalScroll.displayName = "HorizontalScroll";

export default HorizontalScroll;
