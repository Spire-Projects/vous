import type { BaseDocument, AnyTimestamp } from "./base.types";

export interface Banner extends BaseDocument {
  title?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaVisible: boolean;
  isActive: boolean;
  sortOrder: number;
  startDate?: AnyTimestamp;
  endDate?: AnyTimestamp;
}

export type CreateBannerPayload = Omit<Banner, "id" | "createdAt" | "updatedAt">;
export type UpdateBannerPayload = Partial<CreateBannerPayload>;

// ── Colección: faqs ─────────────────────────────────────────────────────────

export interface FAQ extends BaseDocument {
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export type CreateFAQPayload = Omit<FAQ, "id" | "createdAt" | "updatedAt">;
export type UpdateFAQPayload = Partial<CreateFAQPayload>;

// ── Documento: landingConfig/main ───────────────────────────────────────────

export interface LandingSection {
  isVisible: boolean;
  title: string;
  productIds: string[];
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
  [platform: string]: string | undefined;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface LandingConfig {
  sections: {
    featuredProducts: LandingSection;
    newArrivals: LandingSection;
    discountedProducts: LandingSection;
    specialCollections: LandingSection;
    bestSellers: LandingSection;
  };
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
  wholesaleCta: {
    isVisible: boolean;
    title: string;
    subtitle?: string;
  };
  updatedAt: AnyTimestamp;
}

// ── Documento: paymentConfig/main ───────────────────────────────────────────

export interface PaymentConfig {
  qr: {
    isActive: boolean;
    image?: string;
    instructions?: string;
  };
  libelula: {
    isActive: boolean;
    merchantId?: string;
    enableBilling: boolean;
    billingInstructions?: string;
  };
  updatedAt: AnyTimestamp;
}

// ── Documento: siteConfig/main ──────────────────────────────────────────────

export interface SiteConfig {
  siteName: string;
  logo?: string;
  favicon?: string;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  maintenanceMode: boolean;
  updatedAt: AnyTimestamp;
}
