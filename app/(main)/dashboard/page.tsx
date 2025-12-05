import TrendingTracksClient from "./TrendingTracksClient";
// Track 기본 타입
export type Track = {
  name: string;
  duration: string;
  listeners: string;
  mbid: string;
  url: string;

  artist: {
    name: string;
    mbid: string;
    url: string;
  };

  image: {
    size: string;
    "#text": string;
  }[];

  validImage?: string; // optional
};
export default async function MainPage() {
  const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;

  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json`,
    { next: { revalidate: 60 } }
  );

  const data = await res.json();
  const tracks = data?.tracks?.track || [];
  console.log(data);

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
