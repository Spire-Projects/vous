/**
 * LandingSection entity — dominio puro sin dependencias de framework.
 * Secciones configurables de la landing page con productos resueltos.
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
