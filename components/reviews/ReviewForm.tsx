"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  gameId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ gameId, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (content.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          rating,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        setIsSubmitting(false);
        return;
      }

      // Reset form
      setRating(0);
      setContent("");
      setError("");

      // Refresh the page or call onSuccess callback
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-cream-white mb-2">
          Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-vibrant-orange fill-vibrant-orange"
                    : "text-cream-white/30 fill-cream-white/10"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-cream-white/70 text-sm">
              {rating} / 5
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="review-content"
          className="block text-sm font-medium text-cream-white mb-2"
        >
          Your Review *
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          minLength={10}
          maxLength={5000}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-cream-white placeholder-cream-white/50 focus:outline-none focus:ring-2 focus:ring-vibrant-purple resize-none"
          placeholder="Share your thoughts about this game..."
        />
        <div className="mt-1 flex justify-between text-xs text-cream-white/50">
          <span>Minimum 10 characters</span>
          <span>{content.length} / 5000</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || content.length < 10}
        className="w-full sm:w-auto px-6 py-3 bg-vibrant-purple hover:bg-vibrant-purple/90 text-cream-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-cream-white/30 border-t-cream-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
}
