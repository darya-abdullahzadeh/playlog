interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient?: "blue" | "purple" | "navy" | "lilac";
    suffix?: string;
    ratingDistribution?: number[]; // Array of 5 numbers representing counts for 1-5 stars
}

export default function StatCard({ title, value, icon, gradient = "blue", suffix, ratingDistribution }: StatCardProps) {
    const solidColors = {
        blue: 'var(--color-ocean-blue)',
        purple: 'var(--color-vibrant-purple)',
        navy: 'var(--color-near-black)',
        lilac: 'var(--color-vibrant-purple)',
    };

    // Calculate max value for bar scaling
    const maxRatingCount = ratingDistribution ? Math.max(...ratingDistribution) : 0;
    
    // Calculate average rating from distribution
    const averageRating = ratingDistribution ? (() => {
        const totalCount = ratingDistribution.reduce((acc, count) => acc + count, 0);
        const weightedSum = ratingDistribution.reduce((acc, count, index) => acc + (index + 1) * count, 0);
        return totalCount > 0 ? weightedSum / totalCount : 0;
    })() : value;

    return (
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* Solid color background */}
            <div 
                className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: solidColors[gradient] }}
            ></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-white/80 text-sm sm:text-base font-medium">
                        {title}
                    </div>
                    <div className="text-white/60 group-hover:text-white transition-colors">
                        {icon}
                    </div>
                </div>
                {!ratingDistribution && (
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                        {value % 1 === 0 ? value.toLocaleString() : value.toFixed(1)}
                        {suffix && <span className="text-xl sm:text-2xl md:text-3xl ml-1 opacity-80">{suffix}</span>}
                    </p>
                )}

                {/* Rating Distribution Bar Graph */}
                {ratingDistribution && (
                    <div className="mt-2 flex items-center gap-4">
                        <div className="bg-white/20 rounded-lg p-2 flex flex-row gap-1 flex-1">
                            {ratingDistribution.map((count, index) => {
                                const rating = index + 1;
                                const percentage = maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;
                                
                                return (
                                    <div key={rating} className="flex flex-col items-center justify-end gap-1 flex-1">
                                        <span className="text-white/70 text-xs font-medium">{count}</span>
                                        <div className="relative w-full overflow-hidden" style={{ height: '100%', minHeight: '60px' }}>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-white/60 transition-all duration-500"
                                                style={{ height: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-white/70 text-xs font-medium">{rating}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-[80px]">
                            <p className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                                {averageRating.toFixed(1)}
                            </p>
                            {suffix && <span className="text-sm sm:text-base text-white/80 mt-1">{suffix}</span>}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full blur-xl"></div>
        </div>
    )
}