# Database Setup Guide

## Prerequisites

1. **PostgreSQL installed locally**
   - macOS: `brew install postgresql@16` or use Postgres.app
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)

2. **PostgreSQL is running**
   ```bash
   # macOS with Homebrew
   brew services start postgresql@16
   
   # Or check if running
   pg_isready
   ```

## Step 1: Create Database

```bash
# Create the database
createdb playlog

# Or using psql
psql postgres
CREATE DATABASE playlog;
\q
```

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env` (if not already done)
2. Update `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/playlog?schema=public"
DIRECT_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/playlog?schema=public"
```

**Common PostgreSQL defaults:**
- Username: `postgres` (or your system username)
- Password: (empty or your PostgreSQL password)
- Port: `5432`
- Database: `playlog`

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/playlog?schema=public"
DIRECT_URL="postgresql://postgres:mypassword@localhost:5432/playlog?schema=public"
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- Prisma CLI
- Prisma Client
- tsx (for running seed scripts)

## Step 4: Generate Prisma Client

```bash
npm run db:generate
```

This creates the Prisma Client based on your schema.

## Step 5: Run Migrations

```bash
npm run db:migrate
```

This will:
1. Create a migration file
2. Apply it to your database
3. Generate Prisma Client

**First migration name:** You'll be prompted to name it. Use something like `init` or `initial_schema`.

## Step 6: Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This opens a GUI at `http://localhost:5555` where you can see and edit your database.

## Troubleshooting

### Connection Error

If you get a connection error:

1. **Check PostgreSQL is running:**
   ```bash
   pg_isready
   ```

2. **Verify credentials:**
   ```bash
   psql -U postgres -d playlog
   ```

3. **Check connection string format:**
   - No spaces around `=`
   - Proper escaping if password has special characters
   - Correct port (default is 5432)

### Permission Denied

If you get permission errors:

```bash
# Grant permissions (if needed)
psql postgres
GRANT ALL PRIVILEGES ON DATABASE playlog TO YOUR_USERNAME;
\q
```

### Database Already Exists

If the database already exists, migrations will still work. Prisma will sync your schema.

## Production Setup with Prisma Accelerate

1. **Sign up at [Prisma Console](https://console.prisma.io/)**

2. **Create a new Accelerate project**

3. **Connect your production database:**
   - Add your production PostgreSQL connection string
   - Prisma will generate an Accelerate URL

4. **Add to production environment:**
   ```env
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   DIRECT_URL="postgresql://your-production-db-url"  # For migrations only
   ```

5. **Deploy migrations:**
   ```bash
   npm run db:migrate:deploy
   ```

## Useful Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes (development only)
npm run db:push

# Create and apply migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Open database GUI
npm run db:studio

# Run seed script
npm run db:seed
```

## Next Steps

After setup:
1. ✅ Database is ready
2. ⏭️ Set up authentication (NextAuth.js)
3. ⏭️ Create API routes for CRUD operations
4. ⏭️ Build review and rating features
