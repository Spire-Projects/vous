import type { LandingSection } from "@/domain/entities/landing-section.entity";
import type { Product } from "@/domain/entities/product.entity";

export interface LandingSectionWithProducts extends LandingSection {
  products: Product[];
}

export interface LandingSectionRepository {
  findActiveWithProducts(): Promise<LandingSectionWithProducts[]>;
}
