import { User } from "../types";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/admin/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  const data = await response.json();
  return data.users;
}

export interface CreateUserPayload {
  name: string;
  phone: string;
  password: string;
  role_id: string;
  salon_id: string | null;
  status: string;
}

export async function createUser(payload: CreateUserPayload): Promise<void> {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to create user");
  }
}

export interface UpdateUserPayload {
  user_id: string;
  name: string;
  phone: string | null;
  password?: string;
  role_id: string;
  salon_id: string | null;
  status: string;
}

export async function updateUser(payload: UpdateUserPayload): Promise<void> {
  const response = await fetch("/api/admin/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to update user");
  }
}

export async function deleteUser(user_id: string): Promise<void> {
  const response = await fetch(`/api/admin/users?user_id=${user_id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete user");
  }
}

export async function toggleUserStatus(user: User): Promise<void> {
  const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await updateUser({
    user_id: user.user_id,
    name: user.name,
    phone: user.phone,
    role_id: user.role?.role_id || "",
    salon_id: user.salon_id,
    status: newStatus,
  });
}
