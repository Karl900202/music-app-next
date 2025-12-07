"use client";

import { useState, useRef } from "react";
import { Track } from "./page";
import HorizontalScroll, {
  HorizontalScrollRef,
} from "./_components/HorizontalScroll";
import TrackCard from "./_components/TrackCard";

const GENRES = ["ROCK", "BALLAD", "DANCE", "JAZZ", "POP", "K-POP", "SOUL"];

const genreMap: Record<string, string> = {
  ROCK: "rock",
  BALLAD: "ballad",
  DANCE: "dance",
  JAZZ: "jazz",
  POP: "pop",
  "K-POP": "k-pop",
  SOUL: "soul",
};

export default function TrendingTracksClient({ tracks }: { tracks: Track[] }) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [loadingGenre, setLoadingGenre] = useState(false);
  const genreScrollRef = useRef<HorizontalScrollRef>(null);

  const fetchGenreTracks = async (genre: string) => {
    setSelectedGenre(genre);
    setLoadingGenre(true);
    genreScrollRef.current?.scrollToStart();

    try {
      const searchTerm = genreMap[genre] || genre.toLowerCase();
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
        searchTerm
      )}&media=music&limit=50&entity=song`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
        throw new Error("Empty response");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON");
      }

      if (data.results && Array.isArray(data.results)) {
        const tracks = data.results
          .filter(
            (item: { trackName?: string; artistName?: string }) =>
              item.trackName && item.artistName
          )
          .map(
            (item: {
              trackId: number;
              trackName: string;
              artistName: string;
              collectionName?: string;
              artworkUrl100?: string;
              artworkUrl60?: string;
              previewUrl?: string;
              trackTimeMillis?: number;
              primaryGenreName?: string;
            }) => ({
              trackId: item.trackId,
              trackName: item.trackName,
              artistName: item.artistName,
              collectionName: item.collectionName,
              artworkUrl100:
                item.artworkUrl100?.replace("100x100", "600x600") ||
                item.artworkUrl100 ||
                "",
              artworkUrl60: item.artworkUrl60 || "",
              previewUrl: item.previewUrl,
              trackTimeMillis: item.trackTimeMillis,
              primaryGenreName: item.primaryGenreName,
              name: item.trackName,
              artist: {
                name: item.artistName,
              },
              image:
                item.artworkUrl100?.replace("100x100", "600x600") ||
                item.artworkUrl100 ||
                "",
            })
          );

        setGenreTracks(tracks);
      } else {
        setGenreTracks([]);
      }
    } catch (e) {
      console.error("Genre fetch error:", e);
      setGenreTracks([]);
    } finally {
      setLoadingGenre(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-start gap-4 mb-8">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => fetchGenreTracks(genre)}
            className={`rounded-lg text-white text-sm px-3 py-2 transition
              ${
                selectedGenre === genre
                  ? "bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">{selectedGenre} 장르 추천</h2>

          {loadingGenre ? (
            <HorizontalScroll ref={genreScrollRef}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[210px] h-[260px] rounded-xl bg-neutral-800 animate-pulse"
                />
              ))}
            </HorizontalScroll>
          ) : (
            <HorizontalScroll ref={genreScrollRef}>
              {genreTracks.map((track, i) => (
                <TrackCard key={i} track={track} />
              ))}
            </HorizontalScroll>
          )}
        </div>
      )}

      <div>
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
