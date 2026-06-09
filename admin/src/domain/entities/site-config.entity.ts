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

export interface ExtendedSchedule {
  title: string;
  days: ScheduleItem[];
}

export interface DepartmentLink {
  name: string;
  googleMapsUrl: string;
  tiktokUrl?: string;
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
  ubicacion: SocialNetwork;
  googleMapsUrl: string;
  shippingPolicy: string;
  returnPolicy: string;
  termsOfService: string;
  schedule: ScheduleItem[];
  extendedSchedules: ExtendedSchedule[];
  departmentLinks: DepartmentLink[];
  otherCountryLinks: DepartmentLink[];
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
  googleMapsUrl?: string;
  instagram?: SocialNetwork;
  tiktok?: SocialNetwork;
  ubicacion?: SocialNetwork;
  shippingPolicy?: string;
  returnPolicy?: string;
  termsOfService?: string;
  schedule?: ScheduleItem[];
  extendedSchedules?: ExtendedSchedule[];
  departmentLinks?: DepartmentLink[];
  otherCountryLinks?: DepartmentLink[];
}
