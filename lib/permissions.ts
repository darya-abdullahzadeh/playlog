/**
 * User abilities and permissions system
 * 
 * Defines what actions users can perform based on their role
 */

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export enum Permission {
  // User content permissions
  CREATE_REVIEW = "create_review",
  EDIT_OWN_REVIEW = "edit_own_review",
  DELETE_OWN_REVIEW = "delete_own_review",
  LIKE_REVIEW = "like_review",
  COMMENT_ON_REVIEW = "comment_on_review",
  
  // Library permissions
  MANAGE_OWN_LIBRARY = "manage_own_library",
  
  // List permissions
  CREATE_LIST = "create_list",
  EDIT_OWN_LIST = "edit_own_list",
  DELETE_OWN_LIST = "delete_own_list",
  
  // Profile permissions
  EDIT_OWN_PROFILE = "edit_own_profile",
  VIEW_PRIVATE_PROFILES = "view_private_profiles",
  
  // Social permissions
  FOLLOW_USERS = "follow_users",
  UNFOLLOW_USERS = "unfollow_users",
  
  // Moderation permissions (Moderator+)
  MODERATE_REVIEWS = "moderate_reviews",
  DELETE_ANY_REVIEW = "delete_any_review",
  MODERATE_COMMENTS = "moderate_comments",
  DELETE_ANY_COMMENT = "delete_any_comment",
  VIEW_REPORTS = "view_reports",
  
  // Admin permissions
  MANAGE_USERS = "manage_users",
  MANAGE_ROLES = "manage_roles",
  DELETE_ANY_CONTENT = "delete_any_content",
  VIEW_ANALYTICS = "view_analytics",
}

/**
 * Role-based permission mapping
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.CREATE_REVIEW,
    Permission.EDIT_OWN_REVIEW,
    Permission.DELETE_OWN_REVIEW,
    Permission.LIKE_REVIEW,
    Permission.COMMENT_ON_REVIEW,
    Permission.MANAGE_OWN_LIBRARY,
    Permission.CREATE_LIST,
    Permission.EDIT_OWN_LIST,
    Permission.DELETE_OWN_LIST,
    Permission.EDIT_OWN_PROFILE,
    Permission.FOLLOW_USERS,
    Permission.UNFOLLOW_USERS,
  ],
  [UserRole.MODERATOR]: [
    // All user permissions
    Permission.CREATE_REVIEW,
    Permission.EDIT_OWN_REVIEW,
    Permission.DELETE_OWN_REVIEW,
    Permission.LIKE_REVIEW,
    Permission.COMMENT_ON_REVIEW,
    Permission.MANAGE_OWN_LIBRARY,
    Permission.CREATE_LIST,
    Permission.EDIT_OWN_LIST,
    Permission.DELETE_OWN_LIST,
    Permission.EDIT_OWN_PROFILE,
    Permission.FOLLOW_USERS,
    Permission.UNFOLLOW_USERS,
    // Moderator permissions
    Permission.MODERATE_REVIEWS,
    Permission.DELETE_ANY_REVIEW,
    Permission.MODERATE_COMMENTS,
    Permission.DELETE_ANY_COMMENT,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

/**
 * Check if user can perform an action on their own content
 */
export function canManageOwnContent(
  userId: string,
  contentUserId: string,
  permission: Permission
): boolean {
  return userId === contentUserId && hasPermission(UserRole.USER, permission);
}

/**
 * Check if user can perform an action on any content (moderator/admin)
 */
export function canManageAnyContent(role: UserRole, permission: Permission): boolean {
  return hasPermission(role, permission);
}

/**
 * Check if user has at least one of the required permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}
