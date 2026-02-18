/**
 * Authorization helpers for API routes and server components
 */

import { requireAuth } from "./session";
import { prisma } from "./prisma";
import { Permission, UserRole, hasPermission, canManageOwnContent, canManageAnyContent } from "./permissions";

export interface AuthContext {
  userId: string;
  role: UserRole;
  username: string;
}

/**
 * Get current user with role information
 */
export async function getAuthContext(): Promise<AuthContext> {
  const user = await requireAuth();
  
  // Fetch user role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, username: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  return {
    userId: dbUser.id,
    role: dbUser.role as UserRole,
    username: dbUser.username,
  };
}

/**
 * Require a specific permission
 * Throws an error if the user doesn't have the permission
 */
export async function requirePermission(permission: Permission): Promise<AuthContext> {
  const context = await getAuthContext();
  
  if (!hasPermission(context.role, permission)) {
    throw new Error(`Forbidden: Missing permission ${permission}`);
  }

  return context;
}

/**
 * Require ownership or a specific permission
 * Useful for actions on user's own content or moderator/admin actions
 */
export async function requireOwnershipOrPermission(
  contentUserId: string,
  permission: Permission
): Promise<AuthContext> {
  const context = await getAuthContext();
  
  const isOwner = context.userId === contentUserId;
  const hasModPermission = canManageAnyContent(context.role, permission);

  if (!isOwner && !hasModPermission) {
    throw new Error("Forbidden: You don't have permission to perform this action");
  }

  return context;
}

/**
 * Check if user can edit a review
 */
export async function canEditReview(reviewId: string): Promise<AuthContext> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return requireOwnershipOrPermission(
    review.userId,
    Permission.DELETE_ANY_REVIEW
  );
}

/**
 * Check if user can delete a review
 */
export async function canDeleteReview(reviewId: string): Promise<AuthContext> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return requireOwnershipOrPermission(
    review.userId,
    Permission.DELETE_ANY_REVIEW
  );
}

/**
 * Check if user can edit a comment
 */
export async function canEditComment(commentId: string): Promise<AuthContext> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  return requireOwnershipOrPermission(
    comment.userId,
    Permission.DELETE_ANY_COMMENT
  );
}

/**
 * Check if user can delete a comment
 */
export async function canDeleteComment(commentId: string): Promise<AuthContext> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  return requireOwnershipOrPermission(
    comment.userId,
    Permission.DELETE_ANY_COMMENT
  );
}

/**
 * Check if user can edit a list
 */
export async function canEditList(listId: string): Promise<AuthContext> {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { userId: true },
  });

  if (!list) {
    throw new Error("List not found");
  }

  return requireOwnershipOrPermission(
    list.userId,
    Permission.DELETE_OWN_LIST
  );
}

/**
 * Check if user can delete a list
 */
export async function canDeleteList(listId: string): Promise<AuthContext> {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { userId: true },
  });

  if (!list) {
    throw new Error("List not found");
  }

  return requireOwnershipOrPermission(
    list.userId,
    Permission.DELETE_OWN_LIST
  );
}

/**
 * Check if user can manage another user's library
 */
export async function canManageLibrary(userId: string): Promise<AuthContext> {
  const context = await getAuthContext();
  
  if (context.userId !== userId && !canManageAnyContent(context.role, Permission.MANAGE_USERS)) {
    throw new Error("Forbidden: You can only manage your own library");
  }

  return context;
}
