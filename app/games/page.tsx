import { getGames } from "@/services/game.service";
import GameCard from "@/components/games/GameCard";
import GamesSearch from "@/components/games/GamesSearch";
import GamesFilters from "@/components/games/GamesFilters";
import { Suspense } from "react";

interface GamesPageProps {
    searchParams: Promise<{
        search?: string;
        genres?: string;
        platforms?: string;
        page?: string;
    }>;
}

export const dynamic = 'force-dynamic'; // Changed to dynamic to support search params

export default async function Games({ searchParams }: GamesPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const genres = params.genres;
    const platforms = params.platforms;

    let gamesData;
    
    try {
        gamesData = await getGames(page, 20, search, genres, platforms);
    } catch (error) {
        console.error("Error fetching games:", error);
        return (
            <div className="min-h-screen bg-near-black p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-cream-white mb-8">Games</h1>
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                        <p>Failed to load games. Please check your API key configuration.</p>
                        <p className="text-sm mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-near-black p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-cream-white mb-6">Games</h1>
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <Suspense fallback={<div className="w-full max-w-2xl h-12 bg-white/10 rounded-lg animate-pulse" />}>
                            <GamesSearch />
                        </Suspense>
                        <Suspense fallback={<div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />}>
                            <GamesFilters />
                        </Suspense>
                    </div>

                    {/* Active Filters Display */}
                    {(search || genres || platforms) && (
                        <div className="mt-4 flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-cream-white/70">Active filters:</span>
                            {search && (
                                <span className="px-3 py-1 bg-vibrant-purple/30 text-cream-white rounded text-sm border border-vibrant-purple/50">
                                    Search: {search}
                                </span>
                            )}
                            {genres && (
                                <span className="px-3 py-1 bg-vibrant-purple/30 text-cream-white rounded text-sm border border-vibrant-purple/50">
                                    {genres.split(',').length} genre{genres.split(',').length > 1 ? 's' : ''}
                                </span>
                            )}
                            {platforms && (
                                <span className="px-3 py-1 bg-ocean-blue/30 text-cream-white rounded text-sm border border-ocean-blue/50">
                                    {platforms.split(',').length} platform{platforms.split(',').length > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {gamesData.results && gamesData.results.length > 0 ? (
                    <>
                        <div className="mb-4 text-sm text-cream-white/70">
                            Showing {gamesData.results.length} of {gamesData.count} games
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {gamesData.results.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {(gamesData.next || gamesData.previous) && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                {gamesData.previous && (
                                    <a
                                        href={`/games?${new URLSearchParams({
                                            ...(search && { search }),
                                            ...(genres && { genres }),
                                            ...(platforms && { platforms }),
                                            page: (page - 1).toString(),
                                        }).toString()}`}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-cream-white rounded-lg transition-colors border border-white/20"
                                    >
                                        Previous
                                    </a>
                                )}
                                <span className="text-cream-white/70">
                                    Page {page}
                                </span>
                                {gamesData.next && (
                                    <a
                                        href={`/games?${new URLSearchParams({
                                            ...(search && { search }),
                                            ...(genres && { genres }),
                                            ...(platforms && { platforms }),
                                            page: (page + 1).toString(),
                                        }).toString()}`}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-cream-white rounded-lg transition-colors border border-white/20"
                                    >
                                        Next
                                    </a>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-cream-white/70 text-lg">No games found.</p>
                        <p className="text-cream-white/50 text-sm mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}