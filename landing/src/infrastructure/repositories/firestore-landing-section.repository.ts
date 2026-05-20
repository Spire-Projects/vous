import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type {
  LandingSectionRepository,
  LandingSectionWithProducts,
} from "@/domain/repositories/landing-section.repository";
import type { LandingSectionType } from "@/domain/entities/landing-section.entity";
import type { Product } from "@/domain/entities/product.entity";

function mapProductDoc(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    slug: (data.slug as string) ?? "",
    name: (data.name as string) ?? "",
    description: (data.description as string) ?? "",
    detail: (data.detail as string) ?? "",
    price: (data.price as number) ?? 0,
    categoryId: (data.categoryId as string) ?? "",
    categoryName: (data.categoryName as string) ?? "",
    badge: (data.badge as string) ?? undefined,
    images: (data.images as string[]) ?? [],
    sizes: (data.sizes as string[]) ?? [],
    colors: (data.colors as { hex: string; name: string }[]) ?? [],
    materials: (data.materials as string[]) ?? [],
    hasVariants: (data.hasVariants as boolean) ?? false,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    isPreorder: (data.isPreorder as boolean) ?? false,
    isSpecialCollection: (data.isSpecialCollection as boolean) ?? false,
    isBestseller: (data.isBestseller as boolean) ?? false,
    isDiscounted: (data.isDiscounted as boolean) ?? false,
    discountPercentage: (data.discountPercentage as number) ?? undefined,
    stock: (data.stock as number) ?? 0,
    sortOrder: (data.sortOrder as number) ?? 0,
    attributes: (data.attributes as Record<string, string>) ?? {},
    tags: (data.tags as string[]) ?? undefined,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const db = getFirebaseDb();
  // Fetch up to 8 products; Firestore 'in' operator supports up to 30 items
  const batch = ids.slice(0, 8);
  const results = await Promise.all(
    batch.map(async (id) => {
      const snap = await getDoc(doc(db, "products", id));
      if (!snap.exists()) return null;
      const product = mapProductDoc(snap.id, snap.data() as Record<string, unknown>);
      return product.isActive ? product : null;
    })
  );
  return results.filter((p): p is Product => p !== null);
}

export const firestoreLandingSectionRepository: LandingSectionRepository = {
  async findActiveWithProducts(): Promise<LandingSectionWithProducts[]> {
    const db = getFirebaseDb();
    try {
      const q = query(
        collection(db, "landingSections"),
        where("active", "==", true),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      const sections = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          name: (data.name as string) ?? "",
          type: (data.type as LandingSectionType) ?? "featured",
          active: true,
          order: (data.order as number) ?? 0,
          productIds: (data.productIds as string[]) ?? [],
          createdAt:
            (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
            new Date().toISOString(),
          updatedAt:
            (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
            new Date().toISOString(),
        };
      });

      const sectionsWithProducts = await Promise.all(
        sections.map(async (section) => ({
          ...section,
          products: await fetchProductsByIds(section.productIds),
        }))
      );

      return sectionsWithProducts.filter((s) => s.products.length > 0);
    } catch {
      // Fallback without compound index
      const snap = await getDocs(collection(db, "landingSections"));
      const sections = snap.docs
        .map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: (data.name as string) ?? "",
            type: (data.type as LandingSectionType) ?? "featured",
            active: (data.active as boolean) ?? false,
            order: (data.order as number) ?? 0,
            productIds: (data.productIds as string[]) ?? [],
            createdAt:
              (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
              new Date().toISOString(),
            updatedAt:
              (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
              new Date().toISOString(),
          };
        })
        .filter((s) => s.active)
        .sort((a, b) => a.order - b.order);

      const sectionsWithProducts = await Promise.all(
        sections.map(async (section) => ({
          ...section,
          products: await fetchProductsByIds(section.productIds),
        }))
      );

      return sectionsWithProducts.filter((s) => s.products.length > 0);
    }
  },
};
