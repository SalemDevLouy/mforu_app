export type RoleName = "APP_OWNER" | "ACCOUNTANT" | "SALON_OWNER" | "RECEPTIONIST";

export function hasRole(userRole: string | null, expected: RoleName | RoleName[]) {
  if (!userRole) return false;
  const role = userRole as RoleName;
  if (Array.isArray(expected)) return expected.includes(role);
  return role === expected;
}

export function checkSalonAccess(userSalon: string | null, resourceSalonId: string) {
  // App owner (no salon) can access everything; otherwise salon must match
  if (!userSalon) return true; // treat absence as app owner
  return userSalon === resourceSalonId;
}
