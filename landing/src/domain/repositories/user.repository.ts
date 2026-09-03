import type { User } from "@/domain/entities/user.entity";

export interface UserRepository {
  findById(uid: string): Promise<User | null>;
  update(
    uid: string,
    data: Partial<Pick<User, "name" | "phone" | "departamento" | "birthDate">>
  ): Promise<void>;
}
