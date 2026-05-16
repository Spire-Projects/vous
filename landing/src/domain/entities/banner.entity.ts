/**
 * Banner entity — dominio puro sin dependencias de framework.
 */
export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
  order: number;
  createdAt: string;
}
