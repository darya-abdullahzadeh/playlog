# Playlog

A video game logging and social platform inspired by Letterboxd and Backloggd.

## Features

- Browse and discover games (public, no sign-in required)
- Search and filter games by genre, platform, and more
- View detailed game information with screenshots
- Read and write reviews (reviews are public, writing requires sign-in)
- Track your game library with status (Playing, Completed, Dropped, etc.)
- Create custom lists
- Follow other users
- Personal statistics dashboard

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Game Data**: RAWG API
- **Deployment**: Prisma Accelerate for production

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL (local installation)
- RAWG API key ([Get one here](https://rawg.io/apidocs))

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd playlog
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add:
- Your RAWG API key
- Your local PostgreSQL connection string (replace username, password, database name)

Example:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/playlog?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/playlog?schema=public"
```

4. Set up the database
```bash
# Create the database (if it doesn't exist)
createdb playlog

# Run migrations
npm run db:migrate

# Generate Prisma Client
npm run db:generate
```

5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:migrate` - Create and run migrations
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Prisma Accelerate Setup (Production)

1. Sign up at [Prisma Console](https://console.prisma.io/)
2. Create a new Accelerate project
3. Connect your production database
4. Copy the Accelerate URL
5. Add to your production environment:
   ```
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   ```

## Project Structure

```
playlog/
├── app/                    # Next.js app directory
│   ├── games/             # Game pages
│   ├── (auth)/            # Authentication pages (future)
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── games/            # Game-related components
│   ├── home/             # Home page components
│   └── layout/           # Layout components
├── lib/                  # Utilities
│   ├── prisma.ts         # Prisma client instance
│   └── db.ts             # Database helpers
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── services/             # API services
    └── game.service.ts   # RAWG API service
```

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
