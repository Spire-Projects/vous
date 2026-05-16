import type { FAQRepository } from "@/domain/repositories/faq.repository";

export async function deleteFAQ(repo: FAQRepository, id: string): Promise<void> {
  return repo.delete(id);
}
