"use client";

import { Gamepad2Icon } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-vibrant-purple w-screen p-4 sm:p-6 lg:p-10 h-auto sm:h-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-cream-white text-xl sm:text-2xl font-bold flex flex-row items-center gap-2">
          <Gamepad2Icon className="w-6 h-6 sm:w-7 sm:h-7" color="#FF9F1C" /> Playlog
        </h1>
      </Link>
      <nav className="w-full sm:w-auto flex flex-row items-center justify-end">
        <ul className="flex flex-row items-center justify-end gap-3 sm:gap-4 text-cream-white text-sm sm:text-base flex-wrap">
          <li>
            <Link href="/" className="hover:text-vibrant-orange transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/games" className="hover:text-vibrant-orange transition-colors">
              Games
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/library" className="hover:text-vibrant-orange transition-colors">
                  Library
                </Link>
              </li>
              <li>
                <Link href={`/users/${session?.user?.username}`} className="hover:text-vibrant-orange transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 bg-vibrant-orange hover:bg-vibrant-orange/90 text-cream-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/auth/signin"
                  className="px-3 py-1.5 bg-ocean-blue hover:bg-ocean-blue/90 text-cream-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="px-3 py-1.5 bg-vibrant-orange hover:bg-vibrant-orange/90 text-cream-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
