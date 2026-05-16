import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPost, BlogPostStatus } from "@/domain/entities/blog-post.entity";

function mapDoc(id: string, data: Record<string, unknown>): BlogPost {
  const tsToIso = (field: unknown): string | null => {
    const t = field as { toDate?: () => Date } | null;
    return t?.toDate?.().toISOString() ?? null;
  };

  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    content: (data.content as string) ?? "",
    coverImage: (data.coverImage as string) ?? "",
    category: (data.category as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    status: (data.status as BlogPostStatus) ?? "draft",
    featured: (data.featured as boolean) ?? false,
    authorId: (data.authorId as string) ?? "",
    authorName: (data.authorName as string) ?? "",
    createdAt: tsToIso(data.createdAt) ?? new Date().toISOString(),
    publishedAt: tsToIso(data.publishedAt),
    seoTitle: data.seoTitle as string | undefined,
    seoDescription: data.seoDescription as string | undefined,
  };
}

export const firestoreBlogPostRepository: BlogPostRepository = {
  async findPublished(): Promise<BlogPost[]> {
    // Sin where + orderBy combinados para evitar índices compuestos.
    // Traemos todos ordenados por createdAt y filtramos en memoria.
    const q = query(
      collection(getFirebaseDb(), "posts"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.status === "published");
  },

  async findFeatured(): Promise<BlogPost[]> {
    const q = query(
      collection(getFirebaseDb(), "posts"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.status === "published" && p.featured)
      .slice(0, 1);
  },

  async findBySlug(slug: string): Promise<BlogPost | null> {
    // Solo where("slug") — no requiere índice compuesto.
    const q = query(
      collection(getFirebaseDb(), "posts"),
      where("slug", "==", slug)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      const docRef = doc(getFirebaseDb(), "posts", slug);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const mapped = mapDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
      return mapped.status === "published" ? mapped : null;
    }
    const mapped = mapDoc(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>);
    return mapped.status === "published" ? mapped : null;
  },
};
