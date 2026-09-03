import type { FAQRepository } from "@/domain/repositories/faq.repository";
import type { FAQ, CreateFAQInput } from "@/domain/entities/faq.entity";

export async function createFAQ(repo: FAQRepository, input: CreateFAQInput): Promise<FAQ> {
  return repo.create(input);
}
