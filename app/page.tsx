import StatCardList from "@/components/home/StatCardList";
import WelcomeCard from "@/components/home/WelcomeCard";
import PublicWelcome from "@/components/home/PublicWelcome";
import CurrentlyPlaying from "@/components/home/CurrentlyPlaying";
import RecentActivity from "@/components/home/RecentActivity";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  return (
    <div className="flex min-h-screen bg-near-black font-sans">
      <main className="flex w-full flex-col p-4 sm:p-6 lg:p-10 space-y-5">
        {isAuthenticated ? (
          <>
            <WelcomeCard />
            <StatCardList />
            <CurrentlyPlaying />
            <RecentActivity />
          </>
        ) : (
          <>
            <PublicWelcome />
            {/* Public content sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-bold text-cream-white mb-3">Explore Games</h2>
                <p className="text-cream-white/70 mb-4">
                  Browse thousands of games, filter by genre and platform, and discover your next favorite game.
                </p>
                <Link
                  href="/games"
                  className="inline-block px-4 py-2 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors text-sm font-medium"
                >
                  Browse Games →
                </Link>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-bold text-cream-white mb-3">Read Reviews</h2>
                <p className="text-cream-white/70 mb-4">
                  See what the community thinks about games. Read detailed reviews and ratings from other players.
                </p>
                <Link
                  href="/games"
                  className="inline-block px-4 py-2 bg-ocean-blue hover:bg-ocean-blue/90 text-cream-white rounded-lg transition-colors text-sm font-medium"
                >
                  View Reviews →
                </Link>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <h2 className="text-xl font-bold text-cream-white mb-2">Start Tracking Your Games</h2>
              <p className="text-cream-white/70 mb-4">
                Sign in to create your personal game library, write reviews, and connect with other gamers.
              </p>
              <Link
                href="/auth/signin"
                className="inline-block px-6 py-3 bg-vibrant-orange hover:bg-vibrant-orange/90 text-cream-white rounded-lg transition-colors font-semibold"
              >
                Sign In to Get Started
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
