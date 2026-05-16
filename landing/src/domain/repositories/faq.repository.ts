import type { FAQ } from "@/domain/entities/faq.entity";

export interface FAQRepository {
  findActive(): Promise<FAQ[]>;
}
