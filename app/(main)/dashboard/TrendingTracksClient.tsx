"use client";

import { useState } from "react";
import { Track } from "./page";
import HorizontalScroll from "./_components/HorizontalScroll";
import TrackCard from "./_components/TrackCard";

const JENRE = ["ROCK", "BALLAD", "DANCE", "JAZZ", "POP", "K-POP", "SOUL"];

export default function TrendingTracksClient({ tracks }: { tracks: Track[] }) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [loadingGenre, setLoadingGenre] = useState(false);

  const fetchGenreTracks = async (genre: string) => {
    setSelectedGenre(genre);
    setLoadingGenre(true);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
      const tag = genre.toLowerCase();

      const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=${API_KEY}&format=json`;

      const res = await fetch(url);
      const data = await res.json();

      setGenreTracks(data.tracks?.track || []);
    } catch (e) {
      console.error("Genre fetch error:", e);
    } finally {
      setLoadingGenre(false);
    }
  };

  return (
    <div className="mt-10">
      {/* 장르 버튼 */}
      <div className="flex items-center justify-start gap-4 mb-10">
        {JENRE.map((jenre) => (
          <button
            key={jenre}
            onClick={() => fetchGenreTracks(jenre)}
            className={`rounded-lg text-white text-sm px-3 py-2 transition
              ${
                selectedGenre === jenre
                  ? "bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {jenre}
          </button>
        ))}
      </div>

      {/* 장르 추천 */}
      {selectedGenre && (
        <div className="mt-14">
          <h2 className="text-3xl font-bold mb-6">{selectedGenre} 장르 추천</h2>

          {loadingGenre ? (
            <HorizontalScroll>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[210px] h-[260px] rounded-xl bg-neutral-800 animate-pulse"
                />
              ))}
            </HorizontalScroll>
          ) : (
            <HorizontalScroll>
              {genreTracks.map((track, i) => (
                <TrackCard key={i} track={track} />
              ))}
            </HorizontalScroll>
          )}
        </div>
      )}

      {/* 인기 급 상승곡 */}
      <div className="mt-20">
        <h1 className="text-3xl font-bold mb-6">인기 급 상승곡</h1>

        <HorizontalScroll>
          {tracks.map((track, i) => (
            <TrackCard key={i} track={track} />
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}
