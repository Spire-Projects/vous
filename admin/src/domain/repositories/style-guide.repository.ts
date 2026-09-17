import type { StyleGuide, CreateStyleGuideInput, UpdateStyleGuideInput } from "@/domain/entities/style-guide.entity";

export interface StyleGuideRepository {
  findAll(): Promise<StyleGuide[]>;
  findById(id: string): Promise<StyleGuide | null>;
  create(input: CreateStyleGuideInput): Promise<StyleGuide>;
  update(id: string, input: UpdateStyleGuideInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
  setOrder(id: string, order: number): Promise<void>;
}
