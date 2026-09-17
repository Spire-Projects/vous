import type { FAQRepository } from "@/domain/repositories/faq.repository";

export async function setFAQOrder(
  repo: FAQRepository,
  items: { id: string; order: number }[]
): Promise<void> {
  return repo.updateOrder(items);
}
