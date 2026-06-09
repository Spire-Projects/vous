import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteConfigRepository } from "@/domain/repositories/site-config.repository";
import type { SiteConfig, UpdateSiteConfigInput } from "@/domain/entities/site-config.entity";

const DOC_ID = "general";
const COLLECTION = "settings";

function mapDoc(data: Record<string, unknown>): SiteConfig {
  return {
    id: DOC_ID,
    logoUrl: (data.logoUrl as string) ?? "",
    storeName: (data.storeName as string) ?? "VOUS",
    tagline: (data.tagline as string) ?? "Moda urbana contemporánea",
    whatsappNumber: (data.whatsappNumber as string) ?? "",
    whatsappMessage: (data.whatsappMessage as string) ?? "",
    email: (data.email as string) ?? "",
    address: (data.address as string) ?? "",
    city: (data.city as string) ?? "",
    googleMapsUrl: (data.googleMapsUrl as string) ?? "",
    instagram: (data.instagram as SiteConfig["instagram"]) ?? { url: "", active: false },
    tiktok: (data.tiktok as SiteConfig["tiktok"]) ?? { url: "", active: false },
    ubicacion: (data.ubicacion as SiteConfig["ubicacion"]) ?? { url: "", active: false },
    shippingPolicy: (data.shippingPolicy as string) ?? "",
    returnPolicy: (data.returnPolicy as string) ?? "",
    termsOfService: (data.termsOfService as string) ?? "",
    schedule: (data.schedule as SiteConfig["schedule"]) ?? [],
    extendedSchedules: (data.extendedSchedules as SiteConfig["extendedSchedules"]) ?? [],
    departmentLinks: (data.departmentLinks as SiteConfig["departmentLinks"]) ?? [],
    otherCountryLinks: (data.otherCountryLinks as SiteConfig["otherCountryLinks"]) ?? [],
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreSiteConfigRepository: SiteConfigRepository = {
  async get(): Promise<SiteConfig | null> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    return mapDoc(snap.data() as Record<string, unknown>);
  },

  async update(input: UpdateSiteConfigInput): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      { ...input, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },
};
