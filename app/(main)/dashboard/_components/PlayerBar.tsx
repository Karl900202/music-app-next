"use client";

import { usePlayer } from "./PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    pauseTrack,
    resumeTrack,
    setCurrentTime,
    setVolume,
    closePlayer,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);

  const updateVolumeFromEvent = useCallback(
    (clientY: number) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = (clientY - rect.top) / rect.height;
      const newVolume = Math.max(0, Math.min(1, 1 - percent));
      setVolume(newVolume);
    },
    [setVolume]
  );

  useEffect(() => {
    if (!isDraggingVolume) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateVolumeFromEvent(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingVolume, updateVolumeFromEvent]);

  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      setCurrentTime(newTime);
    },
    [duration, setCurrentTime]
  );

  const handleVolumeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingVolume(true);
      updateVolumeFromEvent(e.clientY);
    },
    [updateVolumeFromEvent]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggingVolume) {
        updateVolumeFromEvent(e.clientY);
      }
    },
    [isDraggingVolume, updateVolumeFromEvent]
  );

  const progressPercent = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );
  const volumePercent = useMemo(() => volume * 100, [volume]);

  const imageUrl = useMemo(
    () => currentTrack?.artworkUrl100 || currentTrack?.image,
    [currentTrack]
  );

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900/95 backdrop-blur-sm border-t border-white/10 z-50">
      <div className="h-full px-4 flex items-center justify-between max-w-full">
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1 max-w-[30%]">
          {imageUrl && (
            <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={currentTrack.trackName || "Track"}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-medium truncate">
              {currentTrack.trackName || currentTrack.name}
            </div>
            <div className="text-neutral-400 text-xs truncate">
              {currentTrack.artistName || currentTrack.artist?.name}
            </div>
          </div>
        </div>

        {/* Center: Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
          <div className="flex items-center gap-4">
            <button
              className="text-neutral-400 hover:text-white transition p-2"
              aria-label="Previous track"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={isPlaying ? pauseTrack : resumeTrack}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-black" />
              ) : (
                <Play size={18} className="fill-black ml-0.5" />
              )}
            </button>

            <button
              className="text-neutral-400 hover:text-white transition p-2"
              aria-label="Next track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-neutral-400 text-xs tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressRef}
              className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>
            <span className="text-neutral-400 text-xs tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Additional Controls */}
        <div className="flex items-center gap-4 flex-1 max-w-[30%] justify-end relative">
          <div
            className="relative"
            ref={volumeContainerRef}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              className="text-neutral-400 hover:text-white transition p-2"
              aria-label="Volume"
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {showVolumeSlider && (
              <>
                <div className="absolute bottom-0 right-0 w-12 h-2" />
                <div className="absolute bottom-full right-0 bg-neutral-800 rounded-lg p-3 shadow-lg">
                  <div
                    ref={volumeRef}
                    className="w-2 h-24 bg-white/20 rounded-full cursor-pointer group relative flex items-end select-none"
                    onMouseDown={handleVolumeMouseDown}
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="w-full bg-white rounded-full transition-all"
                      style={{ height: `${volumePercent}%` }}
                    />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ bottom: `calc(${volumePercent}% - 6px)` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={closePlayer}
            className="text-neutral-400 hover:text-white transition p-2"
            aria-label="Close player"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
