import { Star, ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  content: string;
  helpful: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface ReviewListProps {
  reviews: Review[];
  gameId: number;
}

export default function ReviewList({ reviews, gameId }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 text-center">
        <Star className="w-12 h-12 text-cream-white/20 mx-auto mb-3" />
        <p className="text-cream-white/70 mb-2">No reviews yet</p>
        <p className="text-cream-white/50 text-sm">
          Be the first to review this game!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors"
        >
          {/* Review Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vibrant-purple to-ocean-blue flex items-center justify-center text-cream-white font-semibold">
                {review.user.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.displayName || review.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (review.user.displayName || review.user.username)[0].toUpperCase()
                )}
              </div>
              
              {/* User Info */}
              <div>
                <Link
                  href={`/users/${review.user.username}`}
                  className="font-semibold text-cream-white hover:text-vibrant-orange transition-colors"
                >
                  {review.user.displayName || review.user.username}
                </Link>
                <div className="flex items-center gap-2 text-xs text-cream-white/50">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={review.createdAt}>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "text-vibrant-orange fill-vibrant-orange"
                      : "text-cream-white/20 fill-cream-white/10"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-semibold text-cream-white">
                {review.rating}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <p className="text-cream-white/90 leading-relaxed mb-4 whitespace-pre-wrap">
            {review.content}
          </p>

          {/* Review Footer */}
          <div className="flex items-center gap-4 text-sm text-cream-white/70">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{review.helpful} helpful</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{review._count.comments} comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
