import type { CustomerRepository } from "@/domain/repositories/user.repository";
import type { Customer } from "@/domain/entities/user.entity";

export async function getCustomers(repo: CustomerRepository): Promise<Customer[]> {
  return repo.findAll();
}
