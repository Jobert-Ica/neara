import type { Role } from "@prisma/client";

type Action =
  | "browse_professionals"
  | "create_project"
  | "send_request"
  | "view_own_project"
  | "manage_own_project"
  | "accept_request"
  | "decline_request"
  | "purchase_credits"
  | "manage_own_profile"
  | "upload_portfolio"
  | "chat"
  | "leave_review"
  | "view_admin_dashboard"
  | "manage_users"
  | "verify_professionals"
  | "manage_credits"
  | "view_reports"
  | "manage_settings";

type PermissionMatrix = Record<Action, Role[]>;

const PERMISSIONS: PermissionMatrix = {
  browse_professionals: ["CLIENT", "PROFESSIONAL", "ADMIN"],
  create_project: ["CLIENT", "ADMIN"],
  send_request: ["CLIENT", "ADMIN"],
  view_own_project: ["CLIENT", "ADMIN"],
  manage_own_project: ["CLIENT", "ADMIN"],
  accept_request: ["PROFESSIONAL", "ADMIN"],
  decline_request: ["PROFESSIONAL", "ADMIN"],
  purchase_credits: ["PROFESSIONAL", "ADMIN"],
  manage_own_profile: ["PROFESSIONAL", "ADMIN"],
  upload_portfolio: ["PROFESSIONAL", "ADMIN"],
  chat: ["CLIENT", "PROFESSIONAL", "ADMIN"],
  leave_review: ["CLIENT", "ADMIN"],
  view_admin_dashboard: ["ADMIN"],
  manage_users: ["ADMIN"],
  verify_professionals: ["ADMIN"],
  manage_credits: ["ADMIN"],
  view_reports: ["ADMIN"],
  manage_settings: ["ADMIN"],
};

export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[action]?.includes(role) ?? false;
}

export function requireRole(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Role[] = ["CLIENT", "PROFESSIONAL", "ADMIN"];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
