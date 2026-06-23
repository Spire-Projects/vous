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
  lat?: number;
  lng?: number;
}

export interface ContentSection {
  isActive: boolean;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  images?: string[];
  linkUrl?: string;
}

export interface FeedbackSection {
  isActive: boolean;
  title: string;
  subtitle: string;
  successMessage: string;
  emailRecipient: string;
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
  fashionTrends: ContentSection;
  vousNews: ContentSection;
  newPosts: ContentSection;
  feedback: FeedbackSection;
  updatedAt: string;
}
