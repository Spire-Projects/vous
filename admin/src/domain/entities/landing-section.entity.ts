/**
 * LandingSection entity — dominio puro sin dependencias de framework.
 * Representa una sección configurable de productos en la landing page.
 */
export type LandingSectionType =
  | "featured"
  | "new_arrivals"
  | "discounted"
  | "special_collection"
  | "bestseller";

export const LANDING_SECTION_TYPE_LABELS: Record<LandingSectionType, string> = {
  featured: "Destacados",
  new_arrivals: "Nuevos Ingresos",
  discounted: "Con Descuento",
  special_collection: "Colección Especial",
  bestseller: "Más Vendidos",
};

export const LANDING_SECTION_TYPE_COLORS: Record<LandingSectionType, string> = {
  featured: "amber",
  new_arrivals: "blue",
  discounted: "red",
  special_collection: "purple",
  bestseller: "emerald",
};

export interface LandingSection {
  id: string;
  name: string;
  type: LandingSectionType;
  active: boolean;
  order: number;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLandingSectionInput {
  name: string;
  type: LandingSectionType;
  active: boolean;
  order: number;
  productIds: string[];
}

export type UpdateLandingSectionInput = Partial<CreateLandingSectionInput>;
