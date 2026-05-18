import type { BaseDocument, AnyTimestamp } from "./base.types";

// ── Colección: banners ──────────────────────────────────────────────────────

/**
 * Banner del hero de la landing page.
 * Ruta: banners/{bannerId}
 */
export interface Banner extends BaseDocument {
  title?: string;
  subtitle?: string;
  /** URL imagen desktop en Cloudinary */
  image: string;
  /** URL imagen mobile en Cloudinary (opcional, para optimización mobile-first) */
  mobileImage?: string;
  /** Texto del botón CTA, ej: "Ver Colección" */
  ctaText?: string;
  /** URL de destino del botón */
  ctaUrl?: string;
  /** Mostrar u ocultar el botón CTA */
  ctaVisible: boolean;
  isActive: boolean;
  /** Orden de aparición en el carrusel */
  sortOrder: number;
  /** Inicio de visualización para campañas temporales */
  startDate?: AnyTimestamp;
  /** Fin de visualización */
  endDate?: AnyTimestamp;
}

export type CreateBannerPayload = Omit<Banner, "id" | "createdAt" | "updatedAt">;
export type UpdateBannerPayload = Partial<CreateBannerPayload>;

// ── Colección: faqs ─────────────────────────────────────────────────────────

/**
 * Pregunta frecuente administrable.
 * Ruta: faqs/{faqId}
 */
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
  /** IDs de productos seleccionados manualmente para esta sección */
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

/**
 * Configuración centralizada de la landing page.
 * Ruta: landingConfig/main (documento único)
 */
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

/**
 * Configuración de métodos de pago.
 * Ruta: paymentConfig/main (documento único)
 *
 * IMPORTANTE: las claves API de Libélula se almacenan en variables de entorno
 * de Vercel, NUNCA en Firestore.
 */
export interface PaymentConfig {
  qr: {
    isActive: boolean;
    /** URL de imagen del QR en Cloudinary */
    image?: string;
    instructions?: string;
  };
  libelula: {
    isActive: boolean;
    /** Solo IDs no sensibles — las claves API van en variables de entorno */
    merchantId?: string;
    enableBilling: boolean;
    billingInstructions?: string;
  };
  updatedAt: AnyTimestamp;
}

// ── Documento: siteConfig/main ──────────────────────────────────────────────

/**
 * Configuración general del sitio.
 * Ruta: siteConfig/main (documento único)
 */
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
