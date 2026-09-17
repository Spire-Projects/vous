import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { BannerRepository } from "@/domain/repositories/banner.repository";
import type { Banner } from "@/domain/entities/banner.entity";

function mapDoc(id: string, data: Record<string, unknown>): Banner {
  return {
    id,
    imageUrl: (data.imageUrl as string) ?? "",
    mobileImageUrl: data["mobileImageUrl"] as string | undefined,
    tabletImageUrl: data["tabletImageUrl"] as string | undefined,
    title: (data.title as string) ?? "",
    subtitle: (data.subtitle as string) ?? "",
    ctaText: (data.ctaText as string) ?? "",
    ctaUrl: (data.ctaUrl as string) ?? "",
    categorySlug: data["categorySlug"] as string | undefined,
    active: (data.active as boolean) ?? true,
    order: (data.order as number) ?? 0,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreBannerRepository: BannerRepository = {
  async findActive(): Promise<Banner[]> {
    try {
      const q = query(
        collection(getFirebaseDb(), "banners"),
        where("active", "==", true),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
    } catch (err) {
      // Fallback sin índice compuesto
      console.error(
        "[firestoreBannerRepository] Error en query indexada, intentando fallback:",
        err
      );
      const qFallback = query(collection(getFirebaseDb(), "banners"));
      const snap = await getDocs(qFallback);
      return snap.docs
        .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
        .filter((b) => b.active)
        .sort((a, b) => a.order - b.order);
    }
  },
};
