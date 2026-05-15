import type { UserRepository } from "@/domain/repositories/user.repository";
import type { User } from "@/domain/entities/user.entity";

export async function updateUserProfile(
  repo: UserRepository,
  uid: string,
  data: Partial<Pick<User, "name" | "phone" | "departamento" | "birthDate">>
): Promise<void> {
  return repo.update(uid, data);
}
