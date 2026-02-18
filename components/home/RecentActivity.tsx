import Link from "next/link";
import { Clock, Star, Play, CheckCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "completed" | "rated" | "started" | "reviewed";
  gameName: string;
  gameId: number;
  timestamp: Date;
  rating?: number;
  review?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

// Mock data - replace with real data from your API/database
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "completed",
    gameName: "The Witcher 3: Wild Hunt",
    gameId: 3328,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "2",
    type: "rated",
    gameName: "Hades",
    gameId: 4171,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    rating: 5,
  },
  {
    id: "3",
    type: "started",
    gameName: "Elden Ring",
    gameId: 326243,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "4",
    type: "reviewed",
    gameName: "Celeste",
    gameId: 103281,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    rating: 5,
    review: "An absolute masterpiece!",
  },
];

export default function RecentActivity({ activities = mockActivities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-pristine" />;
      case "rated":
        return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-little-boy-blue" />;
      case "started":
        return <Play className="w-4 h-4 sm:w-5 sm:h-5 text-bright-navy-blue" />;
      case "reviewed":
        return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-pretty-posie" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "completed":
        return `Completed ${activity.gameName}`;
      case "rated":
        return `Rated ${activity.gameName} ${activity.rating ? "⭐".repeat(activity.rating) : ""}`;
      case "started":
        return `Started playing ${activity.gameName}`;
      case "reviewed":
        return `Reviewed ${activity.gameName}`;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-lg p-6">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: 'linear-gradient(to bottom right, var(--color-purple-pristine), var(--color-pretty-posie), var(--color-curated-lilac))'
          }}
        ></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Recent Activity</h2>
          <p className="text-white/90 text-sm">No recent activity. Start logging your games!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Recent Activity</h2>
          <Link
            href="/activity"
            className="text-sm text-white/90 hover:text-white underline transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {activities.slice(0, 5).map((activity, index) => {
            const gradientColors = [
              'linear-gradient(to bottom, rgba(120, 53, 171, 0.2), rgba(189, 185, 231, 0.2))',
              'linear-gradient(to bottom, rgba(89, 89, 114, 0.2), rgba(120, 53, 171, 0.2))',
              'linear-gradient(to bottom, rgba(189, 185, 231, 0.2), rgba(108, 138, 220, 0.2))',
              'linear-gradient(to bottom, rgba(75, 92, 106, 0.2), rgba(89, 89, 114, 0.2))',
              'linear-gradient(to bottom, rgba(120, 53, 171, 0.2), rgba(29, 118, 218, 0.2))',
            ];
            
            return (
              <Link
                key={activity.id}
                href={`/games/${activity.gameId}`}
                className={`relative flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-md`}
              >
                {/* Subtle gradient accent */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{ background: gradientColors[index % gradientColors.length] }}
                ></div>
                <div className="shrink-0 mt-0.5 ml-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">
                    {getActivityText(activity)}
                  </p>
                  {activity.review && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 italic">
                      "{activity.review}"
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-purple-pristine dark:text-purple-pristine" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
