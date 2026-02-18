import StatCard from "./StatCard";
import { ClockIcon, GamepadIcon, Star } from "lucide-react";

export default function StatCardList() {
    return (
        <div className="flex flex-row gap-4">
            <StatCard title="Games Played" value={100} icon={<GamepadIcon className="w-5 h-5 sm:w-6 sm:h-6" />} gradient="blue" />
            <StatCard title="Total Hours Played" value={100} icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />} gradient="purple" />
            <StatCard 
                title="Average Rating" 
                value={4.5} 
                icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />} 
                gradient="purple" 
                suffix="/5"
                ratingDistribution={[2, 5, 12, 35, 46]} // Mock data: [1-star, 2-star, 3-star, 4-star, 5-star counts]
            />
        </div>
    )
}