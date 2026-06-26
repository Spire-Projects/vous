/**
 * Banner entity — dominio puro sin dependencias de framework.
 */
export interface Banner {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  tabletImageUrl?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  categorySlug?: string;
  active: boolean;
  order: number;
  createdAt: string;
}
