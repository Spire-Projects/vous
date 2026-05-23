/**
 * SiteConfig entity — configuración general del sitio VOUS.
 */
export interface SocialNetwork {
  url: string;
  active: boolean;
}

export interface ScheduleItem {
  day: string;
  hours: string;
}

export interface SiteConfig {
  id: string;
  logoUrl: string;
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: string;
  city: string;
  instagram: SocialNetwork;
  tiktok: SocialNetwork;
  facebook: SocialNetwork;
  pinterest: SocialNetwork;
  shippingPolicy: string;
  returnPolicy: string;
  termsAndConditions: string;
  schedule: ScheduleItem[];
  updatedAt: string;
}

export interface UpdateSiteConfigInput {
  logoUrl?: string;
  storeName?: string;
  tagline?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  email?: string;
  address?: string;
  city?: string;
  instagram?: SocialNetwork;
  tiktok?: SocialNetwork;
  facebook?: SocialNetwork;
  pinterest?: SocialNetwork;
  shippingPolicy?: string;
  returnPolicy?: string;
  termsAndConditions?: string;
  schedule?: ScheduleItem[];
}
