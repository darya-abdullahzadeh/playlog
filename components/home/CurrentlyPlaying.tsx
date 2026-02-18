import Link from "next/link";
import Image from "next/image";
import { Game } from "@/services/game.service";
import { Play, Clock } from "lucide-react";

interface CurrentlyPlayingGame extends Game {
  hoursPlayed?: number;
  lastPlayed?: Date;
  progress?: number; // 0-100 percentage
}

interface CurrentlyPlayingProps {
  games?: CurrentlyPlayingGame[];
}

// Mock data - replace with real data from your API/database
const mockCurrentlyPlaying: CurrentlyPlayingGame[] = [
  {
    id: 326243,
    name: "Elden Ring",
    released: "2022-02-25",
    background_image: "https://media.rawg.io/media/games/5cc/5cc5f78d2b89fef6b8e8b8c8.jpg",
    rating: 4.7,
    rating_top: 5,
    platforms: [{ platform: { id: 4, name: "PC" } }],
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" },
    ],
    hoursPlayed: 45,
    lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    progress: 65,
  },
  {
    id: 3498,
    name: "Grand Theft Auto V",
    released: "2013-09-17",
    background_image: "https://media.rawg.io/media/games/84d/84da91ac3f43bc0741d7a5a2a463b117.jpg",
    rating: 4.5,
    rating_top: 5,
    platforms: [{ platform: { id: 4, name: "PC" } }],
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" },
    ],
    hoursPlayed: 120,
    lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    progress: 85,
  },
  {
    id: 13536,
    name: "Portal 2",
    released: "2011-04-18",
    background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    rating: 4.6,
    rating_top: 5,
    platforms: [{ platform: { id: 4, name: "PC" } }],
    genres: [
      { id: 7, name: "Puzzle" },
      { id: 4, name: "Action" },
    ],
    hoursPlayed: 8,
    lastPlayed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    progress: 30,
  },
];

export default function CurrentlyPlaying({ games = mockCurrentlyPlaying }: CurrentlyPlayingProps) {
  const formatLastPlayed = (date?: Date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!games || games.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-lg p-6">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: 'linear-gradient(to bottom right, var(--color-little-boy-blue), var(--color-bright-navy-blue), var(--color-free-speech-blue))'
          }}
        ></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Currently Playing</h2>
          <div className="text-center py-8">
            <Play className="w-12 h-12 text-white/80 mx-auto mb-3" />
            <p className="text-white/90 text-sm mb-4">
              No games in progress. Start a new game!
            </p>
            <Link
              href="/games"
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors text-sm border border-white/30"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Currently Playing</h2>
          <Link
            href="/library?status=playing"
            className="text-sm text-white/90 hover:text-white underline transition-colors"
          >
            View all
          </Link>
        </div>

      {/* Mobile: Vertical scrollable list */}
      {/* Desktop: Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {games.slice(0, 3).map((game, index) => {
          const gradients = [
            'linear-gradient(to bottom right, var(--color-purple-pristine), var(--color-pretty-posie))',
            'linear-gradient(to bottom right, var(--color-bright-navy-blue), var(--color-little-boy-blue))',
            'linear-gradient(to bottom right, var(--color-seven-seas), var(--color-curated-lilac))',
          ];
          
          return (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group relative rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Card gradient background */}
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: gradients[index % gradients.length] }}
            ></div>
            {game.background_image && (
              <div className="relative w-full h-32 sm:h-40">
                <Image
                  src={game.background_image}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-corbeau/60 via-transparent to-transparent"></div>
                {game.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-corbeau/50">
                    <div
                      className="h-full transition-all shadow-lg"
                      style={{ 
                        width: `${game.progress}%`,
                        background: 'linear-gradient(to right, var(--color-bright-navy-blue), var(--color-little-boy-blue))'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="relative z-10 p-3 sm:p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {game.name}
              </h3>

              {/* Progress info */}
              {game.progress !== undefined && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {game.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all shadow-sm"
                      style={{ 
                        width: `${game.progress}%`,
                        background: 'linear-gradient(to right, var(--color-bright-navy-blue), var(--color-little-boy-blue), var(--color-purple-pristine))'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center justify-between gap-2 mt-3 text-xs sm:text-sm">
                {game.hoursPlayed !== undefined && (
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{game.hoursPlayed}h</span>
                  </div>
                )}
                {game.lastPlayed && (
                  <span className="text-gray-500 dark:text-gray-500">
                    {formatLastPlayed(game.lastPlayed)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )})}
      </div>
    </div>
    </div>
  );
}
