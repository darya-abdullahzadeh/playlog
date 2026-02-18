# Authentication & API Setup

This document describes the authentication and API routes that have been implemented.

## Authentication

### NextAuth.js v5 Setup

- **Configuration**: `auth.config.ts` - Credentials provider with email/password
- **Auth Handler**: `auth.ts` - Exports handlers, auth, signIn, signOut
- **API Route**: `app/api/auth/[...nextauth]/route.ts` - NextAuth API endpoint
- **Sign Up Route**: `app/api/auth/signup/route.ts` - User registration endpoint

### Features

- Email/password authentication
- Password hashing with bcryptjs
- JWT-based sessions
- Protected routes via middleware
- Session management utilities

### Environment Variables Required

```env
NEXTAUTH_SECRET=your_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

## API Routes

### Library Management (`/api/library`)

#### GET `/api/library`
- Get user's game library
- Query parameters:
  - `status` (optional): Filter by game status
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Items per page (default: 20)
- Returns: `{ games: UserGame[], pagination: {...} }`

#### POST `/api/library`
- Add a game to user's library
- Body:
  ```json
  {
    "gameId": 123,
    "status": "PLAYING",
    "rating": 4.5,
    "hoursPlayed": 10.5,
    "startedDate": "2024-01-01T00:00:00Z",
    "completedDate": null,
    "notes": "Great game!",
    "tags": ["action", "rpg"],
    "platform": "PC"
  }
  ```

#### GET `/api/library/[gameId]`
- Get specific game from user's library
- Returns: `UserGame` object

#### PATCH `/api/library/[gameId]`
- Update game in library
- Body: Same as POST, but all fields optional

#### DELETE `/api/library/[gameId]`
- Remove game from library

## Pages

### Authentication Pages

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Routes

The following routes require authentication (redirects to sign in if not authenticated):
- `/library` - User's game library
- `/profile` - User profile
- `/settings` - User settings

## Database Schema Updates

### User Model
- Added `password` field (String?, nullable for OAuth users)

**Migration Required:**
```bash
npm run db:migrate
npm run db:generate
```

## Session Utilities

### `lib/session.ts`
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user or null
- `requireAuth()` - Get current user or throw error

## Middleware

`middleware.ts` protects routes and redirects unauthenticated users to sign in page with callback URL.

## Components

### Updated Components
- `components/layout/Header.tsx` - Shows auth status, sign in/out buttons
- `app/page.tsx` - Uses real authentication instead of mock

### New Components
- `components/providers/SessionProvider.tsx` - Wraps app with NextAuth SessionProvider

## Usage Examples

### Sign Up
```typescript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    username: "username",
    password: "password123",
    displayName: "Display Name"
  })
});
```

### Sign In (Client-side)
```typescript
import { signIn } from "next-auth/react";

await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
  redirect: false
});
```

### Get Current User (Server-side)
```typescript
import { getCurrentUser } from "@/lib/session";

const user = await getCurrentUser();
if (!user) {
  // Not authenticated
}
```

### Add Game to Library
```typescript
const response = await fetch("/api/library", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    gameId: 123,
    status: "PLAYING"
  })
});
```

## Next Steps

1. Run database migration to add password field:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

2. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` to your `.env` file

3. Test authentication:
   - Sign up a new user
   - Sign in
   - Access protected routes
   - Add games to library

4. Future enhancements:
   - OAuth providers (Google, GitHub, etc.)
   - Email verification
   - Password reset
   - Profile management API routes
   - Review API routes
