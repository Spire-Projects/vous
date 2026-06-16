import type { StyleGuide } from "@/domain/entities/style-guide.entity";

export interface StyleGuideRepository {
  findAll(): Promise<StyleGuide[]>;
}
