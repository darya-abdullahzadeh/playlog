const url = "https://api.rawg.io/api/games";
const apiKey = process.env.RAWG_API_KEY;

export interface Game {
    id: number;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    rating_top: number;
    platforms: Array<{
        platform: {
            id: number;
            name: string;
        };
    }>;
    genres: Array<{
        id: number;
        name: string;
    }>;
}

export interface GamesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Game[];
}

export interface GameDetails extends Game {
    description_raw?: string;
    description?: string;
    metacritic?: number;
    playtime?: number;
    screenshots?: Array<{
        id: number;
        image: string;
    }>;
    short_screenshots?: Array<{
        id: number;
        image: string;
    }>;
    developers?: Array<{
        id: number;
        name: string;
    }>;
    publishers?: Array<{
        id: number;
        name: string;
    }>;
    website?: string;
    reddit_url?: string;
    stores?: Array<{
        store: {
            id: number;
            name: string;
            domain: string;
        };
    }>;
}

export const getGames = async (page: number = 1, pageSize: number = 20, search?: string, genres?: string, platforms?: string): Promise<GamesResponse> => {
    if (!apiKey) {
        throw new Error("RAWG_API_KEY is not configured. Please add RAWG_API_KEY to your .env.local file.");
    }

    try {
        const params = new URLSearchParams({
            key: apiKey,
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (search) params.append('search', search);
        if (genres) params.append('genres', genres);
        if (platforms) params.append('platforms', platforms);

        const apiUrl = `${url}?${params.toString()}`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 }, // Revalidate every hour for static generation
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const data: GamesResponse = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch games: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const getGameById = async (id: number): Promise<GameDetails> => {
    if (!apiKey) {
        throw new Error("RAWG_API_KEY is not configured. Please add RAWG_API_KEY to your .env.local file.");
    }

    try {
        const apiUrl = `${url}/${id}?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 }, // Revalidate every hour for static generation
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch game: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const data: GameDetails = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch game: ${error instanceof Error ? error.message : String(error)}`);
    }
};