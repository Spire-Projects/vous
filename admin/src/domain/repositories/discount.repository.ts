import type {
  Discount,
  CreateDiscountInput,
  UpdateDiscountInput,
} from "@/domain/entities/discount.entity";

export interface DiscountRepository {
  findAll(): Promise<Discount[]>;
  findById(id: string): Promise<Discount | null>;
  findByCode(code: string): Promise<Discount | null>;
  create(input: CreateDiscountInput): Promise<Discount>;
  update(id: string, input: UpdateDiscountInput): Promise<void>;
  delete(id: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
}
