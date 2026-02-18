"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export default function GamesFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const selectedGenres = searchParams.get('genres')?.split(',') || [];
    const selectedPlatforms = searchParams.get('platforms')?.split(',') || [];

    const genres = [
        { id: '4', name: 'Action' },
        { id: '51', name: 'Indie' },
        { id: '3', name: 'Adventure' },
        { id: '5', name: 'RPG' },
        { id: '10', name: 'Strategy' },
        { id: '2', name: 'Shooter' },
        { id: '40', name: 'Casual' },
        { id: '14', name: 'Simulation' },
        { id: '7', name: 'Puzzle' },
        { id: '11', name: 'Arcade' },
    ];

    const platforms = [
        { id: '4', name: 'PC' },
        { id: '1', name: 'Xbox One' },
        { id: '18', name: 'PlayStation 4' },
        { id: '186', name: 'Xbox Series S/X' },
        { id: '187', name: 'PlayStation 5' },
        { id: '7', name: 'Nintendo Switch' },
    ];

    const updateFilters = (type: 'genres' | 'platforms', value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get(type)?.split(',').filter(Boolean) || [];
        
        if (current.includes(value)) {
            const updated = current.filter(id => id !== value);
            if (updated.length > 0) {
                params.set(type, updated.join(','));
            } else {
                params.delete(type);
            }
        } else {
            params.set(type, [...current, value].join(','));
        }
        
        params.set('page', '1');
        router.push(`/games?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('genres');
        params.delete('platforms');
        params.set('page', '1');
        router.push(`/games?${params.toString()}`);
    };

    const hasActiveFilters = selectedGenres.length > 0 || selectedPlatforms.length > 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-cream-white hover:bg-white/20 transition-colors"
            >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                    <span className="px-2 py-0.5 bg-vibrant-orange text-white text-xs rounded-full">
                        {selectedGenres.length + selectedPlatforms.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-near-black border border-white/20 rounded-lg shadow-xl z-50 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-cream-white">Filters</h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-vibrant-orange hover:text-vibrant-orange/80 flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Genres */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-cream-white mb-3">Genres</h4>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        onClick={() => updateFilters('genres', genre.id)}
                                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                                            selectedGenres.includes(genre.id)
                                                ? 'bg-vibrant-purple text-cream-white border border-vibrant-purple'
                                                : 'bg-white/10 text-cream-white/70 border border-white/20 hover:bg-white/20'
                                        }`}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platforms */}
                        <div>
                            <h4 className="text-sm font-semibold text-cream-white mb-3">Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map((platform) => (
                                    <button
                                        key={platform.id}
                                        onClick={() => updateFilters('platforms', platform.id)}
                                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                                            selectedPlatforms.includes(platform.id)
                                                ? 'bg-ocean-blue text-cream-white border border-ocean-blue'
                                                : 'bg-white/10 text-cream-white/70 border border-white/20 hover:bg-white/20'
                                        }`}
                                    >
                                        {platform.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
