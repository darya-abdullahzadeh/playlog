# User Abilities & Permissions System

This document describes the user abilities and permissions system implemented in Playlog.

## Overview

The system uses a **role-based access control (RBAC)** model with three user roles:
- **USER** - Default role for all registered users
- **MODERATOR** - Can moderate content and manage reports
- **ADMIN** - Full access to all features and user management

## User Roles

### USER (Default)
Standard users can:
- Create, edit, and delete their own reviews
- Like and comment on reviews
- Manage their own game library
- Create, edit, and delete their own lists
- Edit their own profile
- Follow/unfollow other users

### MODERATOR
Moderators have all USER permissions plus:
- Moderate reviews (edit/delete any review)
- Moderate comments (edit/delete any comment)
- View reports
- Delete any content

### ADMIN
Admins have all permissions including:
- All USER and MODERATOR permissions
- Manage users (view, edit, delete)
- Manage user roles (promote/demote users)
- View analytics
- Delete any content

## Permissions

All permissions are defined in `lib/permissions.ts`. Key permissions include:

### Content Permissions
- `CREATE_REVIEW` - Create new reviews
- `EDIT_OWN_REVIEW` - Edit own reviews
- `DELETE_OWN_REVIEW` - Delete own reviews
- `LIKE_REVIEW` - Like/unlike reviews
- `COMMENT_ON_REVIEW` - Comment on reviews

### Library Permissions
- `MANAGE_OWN_LIBRARY` - Add/edit/remove games from own library

### List Permissions
- `CREATE_LIST` - Create custom lists
- `EDIT_OWN_LIST` - Edit own lists
- `DELETE_OWN_LIST` - Delete own lists

### Profile Permissions
- `EDIT_OWN_PROFILE` - Edit own profile information
- `VIEW_PRIVATE_PROFILES` - View private profiles (moderator+)

### Social Permissions
- `FOLLOW_USERS` - Follow other users
- `UNFOLLOW_USERS` - Unfollow users

### Moderation Permissions
- `MODERATE_REVIEWS` - Moderate any review
- `DELETE_ANY_REVIEW` - Delete any review
- `MODERATE_COMMENTS` - Moderate any comment
- `DELETE_ANY_COMMENT` - Delete any comment
- `VIEW_REPORTS` - View moderation reports

### Admin Permissions
- `MANAGE_USERS` - Manage user accounts
- `MANAGE_ROLES` - Change user roles
- `DELETE_ANY_CONTENT` - Delete any content
- `VIEW_ANALYTICS` - View platform analytics

## Usage

### In API Routes

```typescript
import { requirePermission } from "@/lib/authorization";
import { Permission } from "@/lib/permissions";

// Require a specific permission
export async function POST(request: NextRequest) {
  const context = await requirePermission(Permission.CREATE_REVIEW);
  // User has permission, proceed...
}

// Require ownership or moderation permission
import { requireOwnershipOrPermission } from "@/lib/authorization";

export async function DELETE(request: NextRequest, { params }) {
  const context = await requireOwnershipOrPermission(
    contentUserId,
    Permission.DELETE_ANY_REVIEW
  );
  // User owns the content OR has moderation permission
}
```

### Helper Functions

```typescript
import { canEditReview, canDeleteReview } from "@/lib/authorization";

// Check if user can edit a review
const context = await canEditReview(reviewId);

// Check if user can delete a review
const context = await canDeleteReview(reviewId);
```

### Permission Checks

```typescript
import { hasPermission, getPermissionsForRole } from "@/lib/permissions";
import { UserRole, Permission } from "@/lib/permissions";

// Check if role has permission
if (hasPermission(UserRole.MODERATOR, Permission.MODERATE_REVIEWS)) {
  // Moderator can moderate reviews
}

// Get all permissions for a role
const permissions = getPermissionsForRole(UserRole.USER);
```

## API Endpoints

### Manage User Roles (Admin Only)

**GET `/api/users/[userId]/role`**
- Get a user's role
- Requires: `MANAGE_ROLES` permission

**PATCH `/api/users/[userId]/role`**
- Update a user's role
- Requires: `MANAGE_ROLES` permission
- Body: `{ "role": "MODERATOR" | "ADMIN" | "USER" }`
- Note: Users cannot change their own role

## Database Schema

The `User` model includes a `role` field:

```prisma
model User {
  role UserRole @default(USER)
  // ... other fields
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
}
```

## Migration

After adding the role field, run:

```bash
npm run db:migrate
npm run db:generate
```

This will:
1. Add the `role` column to the `User` table
2. Set default value to `USER` for existing users
3. Regenerate Prisma Client with role support

## Session Integration

User roles are included in the NextAuth session:

```typescript
import { getSession } from "@/lib/session";

const session = await getSession();
const userRole = session?.user?.role; // UserRole.USER | UserRole.MODERATOR | UserRole.ADMIN
```

## Examples

### Protecting an API Route

```typescript
import { requirePermission } from "@/lib/authorization";
import { Permission } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    // Require CREATE_REVIEW permission
    const context = await requirePermission(Permission.CREATE_REVIEW);
    
    // User has permission, create review...
    const review = await prisma.review.create({
      data: {
        userId: context.userId,
        // ... review data
      },
    });
    
    return NextResponse.json(review);
  } catch (error) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "You don't have permission to create reviews" },
        { status: 403 }
      );
    }
    // Handle other errors...
  }
}
```

### Checking Ownership

```typescript
import { requireOwnershipOrPermission } from "@/lib/authorization";
import { Permission } from "@/lib/permissions";

export async function DELETE(request: NextRequest, { params }) {
  const { reviewId } = await params;
  
  try {
    // User must own the review OR have DELETE_ANY_REVIEW permission
    const context = await requireOwnershipOrPermission(
      review.userId,
      Permission.DELETE_ANY_REVIEW
    );
    
    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    if (error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "You don't have permission to delete this review" },
        { status: 403 }
      );
    }
  }
}
```

## Best Practices

1. **Always check permissions in API routes** - Don't rely on client-side checks
2. **Use helper functions** - `canEditReview`, `canDeleteReview`, etc. for common checks
3. **Return clear error messages** - Use 403 Forbidden for permission errors
4. **Log permission failures** - Helpful for security auditing
5. **Test permission boundaries** - Ensure users can't access resources they shouldn't
