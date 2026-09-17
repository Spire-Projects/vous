import { collection, getDocs, query, where, orderBy, limit, documentId } from "firebase/firestore";
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
    colors: (data.colors as { hex: string; name: string; images?: string[] }[]) ?? [],
    materials: (data.materials as string[]) ?? [],
    hasVariants: (data.hasVariants as boolean) ?? false,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    isPreorder: (data.isPreorder as boolean) ?? false,
    isSpecialCollection: (data.isSpecialCollection as boolean) ?? false,
    isBestseller: (data.isBestseller as boolean) ?? false,
    isDiscounted: (data.isDiscounted as boolean) ?? false,
    discountPercentage: (data.discountPercentage as number) ?? undefined,
    wholesalePrice: (data.wholesalePrice as number) ?? undefined,
    wholesaleOnly: (data.wholesaleOnly as boolean) ?? undefined,
    wholesaleStock: (data.wholesaleStock as number) ?? undefined,
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

async function fetchProductsForSection(
  type: LandingSectionType,
  productIds: string[]
): Promise<Product[]> {
  const db = getFirebaseDb();

  if (productIds.length > 0) {
    const batch = productIds.slice(0, 8);
    const q = query(collection(db, "products"), where(documentId(), "in", batch));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapProductDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.isActive && (p.stock > 0 || p.hasVariants));
  }

  // Auto-fetch by type with compound index, fall back to client-side filter
  try {
    let q;
    switch (type) {
      case "featured":
        q = query(
          collection(db, "products"),
          where("isFeatured", "==", true),
          where("isActive", "==", true),
          limit(8)
        );
        break;
      case "discounted":
        q = query(
          collection(db, "products"),
          where("isDiscounted", "==", true),
          where("isActive", "==", true),
          limit(8)
        );
        break;
      case "special_collection":
        q = query(
          collection(db, "products"),
          where("isSpecialCollection", "==", true),
          where("isActive", "==", true),
          limit(8)
        );
        break;
      case "bestseller":
        q = query(
          collection(db, "products"),
          where("isBestseller", "==", true),
          where("isActive", "==", true),
          limit(8)
        );
        break;
      default:
        q = query(
          collection(db, "products"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(8)
        );
    }
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapProductDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.stock > 0 || p.hasVariants);
  } catch {
    // Server-side index missing → fall back to client-side filtering
    const snap = await getDocs(collection(db, "products"));
    let all = snap.docs
      .map((d) => mapProductDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.isActive && (p.stock > 0 || p.hasVariants));

    switch (type) {
      case "featured":
        all = all.filter((p) => p.isFeatured);
        break;
      case "discounted":
        all = all.filter((p) => p.isDiscounted);
        break;
      case "special_collection":
        all = all.filter((p) => p.isSpecialCollection);
        break;
      case "bestseller":
        all = all.filter((p) => p.isBestseller);
        break;
      case "new_arrivals":
      default:
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return all.slice(0, 8);
  }
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
          customType: data["customType"] as string | undefined,
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
          products: await fetchProductsForSection(section.type, section.productIds),
        }))
      );

      return sectionsWithProducts.filter((s) => s.products.length > 0);
    } catch (err) {
      // Only fall back to a client-side scan when the compound index is missing.
      // Re-throw permission, network or other failures so they don't get masked.
      const msg = err instanceof Error ? err.message : "";
      const code = (err as { code?: string }).code ?? "";
      const isMissingIndex = code === "failed-precondition" || msg.toLowerCase().includes("index");
      if (!isMissingIndex) throw err;

      const snap = await getDocs(collection(db, "landingSections"));
      const sections = snap.docs
        .map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: (data.name as string) ?? "",
            type: (data.type as LandingSectionType) ?? "featured",
            active: (data.active as boolean) ?? false,
            customType: data["customType"] as string | undefined,
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
          products: await fetchProductsForSection(section.type, section.productIds),
        }))
      );

      return sectionsWithProducts.filter((s) => s.products.length > 0);
    }
  },
};
