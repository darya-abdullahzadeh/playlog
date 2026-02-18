import { getGameById } from "@/services/game.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Clock, ExternalLink } from "lucide-react";
import { getSession } from "@/lib/session";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import { prisma } from "@/lib/prisma";

interface GameDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
    const { id } = await params;
    const gameId = parseInt(id);
    let game;
    
    try {
        game = await getGameById(gameId);
    } catch (error) {
        console.error("Error fetching game:", error);
        notFound();
    }

    if (!game) {
        notFound();
    }

    // Get current session
    const session = await getSession();
    const isAuthenticated = !!session?.user;

    // Fetch reviews for this game (latest 5)
    const [reviewsData, totalReviews] = await Promise.all([
        prisma.review.findMany({
            where: { gameId: gameId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        }),
        prisma.review.count({
            where: { gameId: gameId },
        }),
    ]);

    // Convert Date objects to ISO strings for ReviewList component
    const reviews = reviewsData.map((review) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        helpful: review.helpful,
        createdAt: review.createdAt.toISOString(),
        user: review.user,
        _count: review._count,
    }));

    // Check if user has already reviewed this game
    let userReview = null;
    if (isAuthenticated && session.user) {
        userReview = await prisma.review.findUnique({
            where: {
                userId_gameId: {
                    userId: session.user.id,
                    gameId: gameId,
                },
            },
        });
    }

    return (
        <div className="min-h-screen bg-near-black">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
                {game.background_image && (
                    <>
                        <Image
                            src={game.background_image}
                            alt={game.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/80 to-transparent" />
                    </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cream-white mb-4 drop-shadow-lg">
                            {game.name}
                        </h1>
                        {game.rating && (
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-6 h-6 text-vibrant-orange fill-vibrant-orange" />
                                    <span className="text-2xl font-bold text-cream-white">
                                        {game.rating.toFixed(1)}
                                    </span>
                                    <span className="text-cream-white/70">/ {game.rating_top}</span>
                                </div>
                                {game.metacritic && (
                                    <div className="px-3 py-1 bg-green-600 text-white font-semibold rounded">
                                        {game.metacritic}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {game.description_raw && (
                            <section>
                                <h2 className="text-2xl font-bold text-cream-white mb-4">About</h2>
                                <p className="text-cream-white/90 leading-relaxed whitespace-pre-line">
                                    {game.description_raw}
                                </p>
                            </section>
                        )}

                        {/* Screenshots */}
                        {game.short_screenshots && game.short_screenshots.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-cream-white mb-4">Screenshots</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {game.short_screenshots.slice(0, 6).map((screenshot) => (
                                        <div key={screenshot.id} className="relative aspect-video rounded-lg overflow-hidden">
                                            <Image
                                                src={screenshot.image}
                                                alt={`${game.name} screenshot`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Game Info */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-cream-white mb-4">Game Info</h3>
                            <div className="space-y-3">
                                {game.released && (
                                    <div className="flex items-center gap-2 text-cream-white/90">
                                        <Calendar className="w-4 h-4 text-vibrant-orange" />
                                        <span className="text-sm">
                                            {new Date(game.released).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                                {game.playtime && (
                                    <div className="flex items-center gap-2 text-cream-white/90">
                                        <Clock className="w-4 h-4 text-vibrant-orange" />
                                        <span className="text-sm">Avg. {game.playtime} hours</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Platforms */}
                        {game.platforms && game.platforms.length > 0 && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-cream-white mb-4">Platforms</h3>
                                <div className="flex flex-wrap gap-2">
                                    {game.platforms.map((platform) => (
                                        <span
                                            key={platform.platform.id}
                                            className="px-3 py-1 bg-ocean-blue/30 text-cream-white rounded text-sm border border-ocean-blue/50"
                                        >
                                            {platform.platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Genres */}
                        {game.genres && game.genres.length > 0 && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-cream-white mb-4">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {game.genres.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            href={`/games?genres=${genre.id}`}
                                            className="px-3 py-1 bg-vibrant-purple/30 text-cream-white rounded text-sm border border-vibrant-purple/50 hover:bg-vibrant-purple/50 transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Developers & Publishers */}
                        {(game.developers || game.publishers) && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-cream-white mb-4">Details</h3>
                                <div className="space-y-3 text-sm text-cream-white/90">
                                    {game.developers && game.developers.length > 0 && (
                                        <div>
                                            <span className="font-semibold">Developer{game.developers.length > 1 ? 's' : ''}: </span>
                                            <span>{game.developers.map(d => d.name).join(', ')}</span>
                                        </div>
                                    )}
                                    {game.publishers && game.publishers.length > 0 && (
                                        <div>
                                            <span className="font-semibold">Publisher{game.publishers.length > 1 ? 's' : ''}: </span>
                                            <span>{game.publishers.map(p => p.name).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* External Links */}
                        {(game.website || game.reddit_url) && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-cream-white mb-4">Links</h3>
                                <div className="space-y-2">
                                    {game.website && (
                                        <a
                                            href={game.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-cream-white/90 hover:text-cream-white transition-colors text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Official Website
                                        </a>
                                    )}
                                    {game.reddit_url && (
                                        <a
                                            href={game.reddit_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-cream-white/90 hover:text-cream-white transition-colors text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Reddit
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-cream-white">
                            Reviews
                            {totalReviews > 0 && (
                                <span className="ml-2 text-lg font-normal text-cream-white/70">
                                    ({totalReviews})
                                </span>
                            )}
                        </h2>
                        {totalReviews > 5 && (
                            <Link
                                href={`/games/${game.id}/reviews`}
                                className="text-vibrant-orange hover:text-vibrant-orange/80 transition-colors text-sm"
                            >
                                View all reviews →
                            </Link>
                        )}
                    </div>

                    {/* Review Form (if authenticated and hasn't reviewed) */}
                    {isAuthenticated && !userReview && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6">
                            <h3 className="text-lg font-semibold text-cream-white mb-4">
                                Write a Review
                            </h3>
                            <ReviewForm gameId={gameId} />
                        </div>
                    )}

                    {/* Sign in prompt (if not authenticated) */}
                    {!isAuthenticated && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6 text-center">
                            <p className="text-cream-white/70 mb-4">
                                Sign in to write a review
                            </p>
                            <Link
                                href={`/auth/signin?callbackUrl=/games/${gameId}`}
                                className="inline-block px-6 py-2 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors font-semibold"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Already reviewed message */}
                    {isAuthenticated && userReview && (
                        <div className="bg-ocean-blue/20 backdrop-blur-sm rounded-lg p-4 border border-ocean-blue/50 mb-6">
                            <p className="text-cream-white/90 text-sm">
                                ✓ You've already reviewed this game.{" "}
                                <Link
                                    href={`/games/${gameId}/reviews`}
                                    className="text-vibrant-orange hover:text-vibrant-orange/80 underline"
                                >
                                    View your review
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <ReviewList reviews={reviews} gameId={gameId} />
                </section>
            </div>
        </div>
    );
}
