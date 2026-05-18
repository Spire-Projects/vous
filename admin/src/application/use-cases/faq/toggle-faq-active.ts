import type { FAQRepository } from "@/domain/repositories/faq.repository";

export async function setFAQActive(repo: FAQRepository, id: string, isActive: boolean): Promise<void> {
  return repo.setActive(id, isActive);
}
