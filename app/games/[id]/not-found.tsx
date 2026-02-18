import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-near-black flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-cream-white mb-4">Game Not Found</h1>
                <p className="text-cream-white/70 mb-8">
                    The game you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/games"
                    className="inline-block px-6 py-3 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors"
                >
                    Browse Games
                </Link>
            </div>
        </div>
    );
}
