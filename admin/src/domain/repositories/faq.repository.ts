import type { FAQ, CreateFAQInput, UpdateFAQInput } from "@/domain/entities/faq.entity";

export interface FAQRepository {
  findAll(): Promise<FAQ[]>;
  findById(id: string): Promise<FAQ | null>;
  create(input: CreateFAQInput): Promise<FAQ>;
  update(id: string, input: UpdateFAQInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
  updateOrder(items: { id: string; order: number }[]): Promise<void>;
}
