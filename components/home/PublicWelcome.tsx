import Link from "next/link";
import { Gamepad2, Search, Star } from "lucide-react";

export default function PublicWelcome() {
    return (
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 md:p-10">
            {/* Gradient background */}
            <div 
                className="absolute inset-0 opacity-90"
                style={{
                    background: 'linear-gradient(to bottom right, var(--color-vibrant-purple), var(--color-ocean-blue), var(--color-vibrant-orange))'
                }}
            ></div>
            
            {/* Content */}
            <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream-white mb-3 drop-shadow-lg">
                    Welcome to Playlog
                </h1>
                <p className="text-cream-white/90 text-sm sm:text-base mb-6 drop-shadow-md">
                    Discover, explore, and track your favorite video games. Browse thousands of games, read reviews, and build your gaming library.
                </p>
                
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/games"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cream-white text-near-black rounded-lg font-semibold hover:bg-cream-white/90 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        Browse Games
                    </Link>
                    <Link
                        href="/games"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-cream-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
                    >
                        <Star className="w-5 h-5" />
                        View Reviews
                    </Link>
                </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
        </div>
    );
}
