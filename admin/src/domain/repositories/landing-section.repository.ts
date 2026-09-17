import type {
  LandingSection,
  CreateLandingSectionInput,
  UpdateLandingSectionInput,
} from "@/domain/entities/landing-section.entity";

export interface LandingSectionRepository {
  findAll(): Promise<LandingSection[]>;
  findById(id: string): Promise<LandingSection | null>;
  create(input: CreateLandingSectionInput): Promise<LandingSection>;
  update(id: string, input: UpdateLandingSectionInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
  updateOrder(id: string, order: number): Promise<void>;
  setProducts(id: string, productIds: string[]): Promise<void>;
}
