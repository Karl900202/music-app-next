"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Track } from "../page";
import { useRef, useState, useEffect, memo, useCallback } from "react";
import { usePlayer } from "./PlayerContext";

function TrackCard({ track }: { track: Track }) {
  const { playTrack } = usePlayer();
  const imageUrl = track.artworkUrl100 || track.image || null;
  const refs = {
    trackName: useRef<HTMLSpanElement>(null),
    artistName: useRef<HTMLSpanElement>(null),
    trackNameContainer: useRef<HTMLDivElement>(null),
    artistNameContainer: useRef<HTMLDivElement>(null),
  };
  const [isHovered, setIsHovered] = useState(false);
  const [textInfo, setTextInfo] = useState({
    trackName: { shouldScroll: false, width: 0 },
    artistName: { shouldScroll: false, width: 0 },
  });

  useEffect(() => {
    const checkOverflow = () => {
      const updateTextInfo = (
        textRef: React.RefObject<HTMLSpanElement | null>,
        containerRef: React.RefObject<HTMLDivElement | null>,
        key: "trackName" | "artistName"
      ) => {
        if (textRef.current && containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const textWidth = textRef.current.scrollWidth;
          setTextInfo((prev) => ({
            ...prev,
            [key]: {
              shouldScroll: textWidth > containerWidth,
              width: textWidth,
            },
          }));
        }
      };

      updateTextInfo(refs.trackName, refs.trackNameContainer, "trackName");
      updateTextInfo(refs.artistName, refs.artistNameContainer, "artistName");
    };

    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  const handleCardClick = useCallback(() => {
    if (track.previewUrl) {
      playTrack(track);
    }
  }, [track, playTrack]);

  const handlePlayButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (track.previewUrl) {
        playTrack(track);
      }
    },
    [track, playTrack]
  );

  return (
    <div
      className="group relative w-[210px] min-w-[210px] bg-neutral-900 rounded-xl p-3 flex flex-col gap-3 shadow-lg cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-[210px] bg-neutral-800 rounded-lg overflow-hidden group/image">
        {imageUrl ? (
          <>
            <Image
              width={210}
              height={210}
              src={imageUrl}
              alt={track.trackName || track.name || "Track"}
              className="rounded-lg transition-all duration-300 group-hover/image:brightness-50 group-hover/image:scale-[1.02] object-cover w-full h-full"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 rounded-lg" />

            <button
              onClick={handlePlayButtonClick}
              className="absolute inset-0 m-auto w-[33.6px] h-[33.6px] rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-75 group-hover/image:opacity-100 group-hover/image:scale-100 transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:scale-110 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] active:scale-105 z-10 cursor-pointer"
              aria-label="Play track"
            >
              <Play size={15.4} className="ml-0.5 fill-black" strokeWidth={2} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-400">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-xs text-center px-2">
              {track.artistName || track.artist?.name || "Unknown"}
            </p>
          </div>
        )}
      </div>

      {(["trackName", "artistName"] as const).map((key) => {
        const info = textInfo[key];
        const text =
          key === "trackName"
            ? track.trackName || track.name
            : track.artistName || track.artist?.name;
        const textRef = refs[key];
        const containerRef = refs[
          `${key}Container` as keyof typeof refs
        ] as React.RefObject<HTMLDivElement>;
        const className =
          key === "trackName"
            ? "text-white font-semibold text-sm"
            : "text-neutral-400 text-xs";

        return (
          <div
            key={key}
            ref={containerRef}
            className="w-full overflow-hidden relative"
          >
            <div
              className={`flex whitespace-nowrap ${
                isHovered && info.shouldScroll ? "animate-scroll-text" : ""
              }`}
              style={
                {
                  animationDuration:
                    info.width > 0
                      ? `${Math.max(info.width * 0.03, 3)}s`
                      : "10s",
                  "--scroll-distance": `${info.width + 32}px`,
                } as React.CSSProperties
              }
            >
              <span ref={textRef} className={`${className} inline-block`}>
                {text}
              </span>
              {info.shouldScroll && (
                <>
                  <span className={`${className} inline-block ml-8`}>
                    {text}
                  </span>
                  <span className={`${className} inline-block ml-8`}>
                    {text}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(TrackCard, (prevProps, nextProps) => {
  return (
    prevProps.track.trackId === nextProps.track.trackId &&
    prevProps.track.trackName === nextProps.track.trackName &&
    prevProps.track.artistName === nextProps.track.artistName &&
    prevProps.track.artworkUrl100 === nextProps.track.artworkUrl100 &&
    prevProps.track.previewUrl === nextProps.track.previewUrl
  );
});
