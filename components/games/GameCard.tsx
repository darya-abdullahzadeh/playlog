import Image from "next/image";
import Link from "next/link";
import { Game } from "@/services/game.service";
import { Star } from "lucide-react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        {game.background_image && (
          <div className="relative w-full h-48">
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {game.name}
          </h2>
          {game.released && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {new Date(game.released).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </p>
          )}
          {game.rating && (
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-vibrant-orange fill-vibrant-orange" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {game.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">/ {game.rating_top}</span>
            </div>
          )}
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {game.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 py-1 text-xs bg-vibrant-purple/20 text-vibrant-purple dark:bg-vibrant-purple/30 dark:text-purple-300 rounded border border-vibrant-purple/30"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}