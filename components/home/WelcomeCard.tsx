export default function WelcomeCard() {
    return (
        <div className="relative w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 md:p-10">
            {/* Gradient background */}
            <div 
                className="absolute inset-0 opacity-90"
                style={{
                    background: 'linear-gradient(to bottom right, var(--color-purple-pristine), var(--color-pretty-posie), var(--color-little-boy-blue))'
                }}
            ></div>
            
            {/* Content */}
            <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    Welcome back Darya!
                </h1>
                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">
                    Welcome to the Playlog
                </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
        </div>
    )
}