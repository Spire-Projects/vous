import type { AdminUserRepository } from "@/domain/repositories/user.repository";
import type { AdminUser } from "@/domain/entities/user.entity";

export async function getAdminUsers(repo: AdminUserRepository): Promise<AdminUser[]> {
  return repo.findAll();
}

export async function setAdminUserActive(
  repo: AdminUserRepository,
  uid: string,
  isActive: boolean
): Promise<void> {
  return repo.setActive(uid, isActive);
}
