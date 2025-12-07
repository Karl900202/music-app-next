import TrendingTracksClient from "./TrendingTracksClient";

export type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100: string;
  artworkUrl60: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  name: string;
  artist: {
    name: string;
  };
  image?: string;
};

async function getPopularTracks(): Promise<Track[]> {
  const popularSearches = [
    "pop",
    "rock",
    "k-pop",
    "hip hop",
    "electronic",
    "jazz",
    "classical",
  ];

  const allTracks: Track[] = [];
  const trackIds = new Set<number>();

  for (const search of popularSearches) {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          search
        )}&media=music&limit=20&entity=song`,
        { next: { revalidate: 3600 } }
      );

      if (!res.ok) {
        console.error(`HTTP error for ${search}! status: ${res.status}`);
        continue;
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
        console.error(`Empty response for ${search}`);
        continue;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON parse error for ${search}:`, parseError);
        continue;
      }

      if (data.results && Array.isArray(data.results)) {
        for (const item of data.results) {
          if (
            !trackIds.has(item.trackId) &&
            item.trackName &&
            item.artistName
          ) {
            trackIds.add(item.trackId);
            allTracks.push({
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
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching tracks for ${search}:`, error);
    }
  }

  return allTracks.sort(() => Math.random() - 0.5).slice(0, 50);
}

export default async function MainPage() {
  const tracks = await getPopularTracks();

  return (
    <div className="w-9/10 h-full text-neutral-100 p-6 select-none overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-1">Welcome to MyMusic</h1>
      <p className="text-neutral-400 text-sm">
        Personal music streaming playground
      </p>

      <TrendingTracksClient tracks={tracks} />
    </div>
  );
}
