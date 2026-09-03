import type { FAQRepository } from "@/domain/repositories/faq.repository";
import type { UpdateFAQInput } from "@/domain/entities/faq.entity";

export async function updateFAQ(repo: FAQRepository, id: string, input: UpdateFAQInput): Promise<void> {
  return repo.update(id, input);
}
