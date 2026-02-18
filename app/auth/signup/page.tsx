"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Automatically sign in after successful signup
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but sign in failed. Please try signing in.");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-near-black items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-cream-white mb-2">Sign Up</h1>
          <p className="text-cream-white/70 mb-6">
            Create your Playlog account to start tracking games
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-cream-white mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream-white placeholder-cream-white/50 focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-cream-white mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={30}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream-white placeholder-cream-white/50 focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
                placeholder="username"
              />
              <p className="mt-1 text-xs text-cream-white/50">
                3-30 characters, letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-cream-white mb-2"
              >
                Display Name (Optional)
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream-white placeholder-cream-white/50 focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-cream-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream-white placeholder-cream-white/50 focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-cream-white/50">
                At least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cream-white/70">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-vibrant-purple hover:text-vibrant-purple/80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
