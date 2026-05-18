import type { FAQRepository } from "@/domain/repositories/faq.repository";
import type { FAQ } from "@/domain/entities/faq.entity";

export async function getFAQs(repo: FAQRepository): Promise<FAQ[]> {
  return repo.findAll();
}
