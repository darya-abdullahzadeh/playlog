import { getGameById } from "@/services/game.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

interface GameReviewsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function GameReviewsPage({ params }: GameReviewsPageProps) {
    const { id } = await params;
    let game;
    
    try {
        game = await getGameById(parseInt(id));
    } catch (error) {
        console.error("Error fetching game:", error);
        notFound();
    }

    if (!game) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-near-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/games/${id}`}
                        className="inline-flex items-center gap-2 text-cream-white/70 hover:text-cream-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to game
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-cream-white">
                            Reviews for {game.name}
                        </h1>
                    </div>
                    {game.rating && (
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-vibrant-orange fill-vibrant-orange" />
                            <span className="text-xl font-semibold text-cream-white">
                                {game.rating.toFixed(1)}
                            </span>
                            <span className="text-cream-white/70">/ {game.rating_top}</span>
                            <span className="text-cream-white/50">•</span>
                            <span className="text-cream-white/70">Community Rating</span>
                        </div>
                    )}
                </div>

                {/* Reviews Placeholder */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/10 text-center">
                    <Star className="w-16 h-16 text-cream-white/20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-cream-white mb-2">No reviews yet</h2>
                    <p className="text-cream-white/70 mb-6 max-w-md mx-auto">
                        Be the first to review this game! Sign in to share your thoughts with the community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors">
                            Sign in to Review
                        </button>
                        <Link
                            href={`/games/${id}`}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-cream-white rounded-lg transition-colors border border-white/20 text-center"
                        >
                            View Game Details
                        </Link>
                    </div>
                </div>

                {/* Future Reviews List Placeholder */}
                <div className="mt-8 space-y-4">
                    <div className="text-sm text-cream-white/50 text-center">
                        Reviews will appear here once users start writing them
                    </div>
                </div>
            </div>
        </div>
    );
}
