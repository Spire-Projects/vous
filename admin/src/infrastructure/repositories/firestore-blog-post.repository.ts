import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPost, BlogPostStatus, CreateBlogPostInput, UpdateBlogPostInput } from "@/domain/entities/blog-post.entity";

function mapDoc(id: string, data: Record<string, unknown>): BlogPost {
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
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    publishedAt: (data.publishedAt as { toDate?: () => Date } | null)?.toDate?.()?.toISOString() ?? null,
    seoTitle: data.seoTitle as string | undefined,
    seoDescription: data.seoDescription as string | undefined,
  };
}

export const firestoreBlogPostRepository: BlogPostRepository = {
  async findAll(): Promise<BlogPost[]> {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<BlogPost | null> {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateBlogPostInput): Promise<BlogPost> {
    const docRef = await addDoc(collection(db, "posts"), {
      ...input,
      coverImage: input.coverImage ?? "",
      createdAt: serverTimestamp(),
      publishedAt: input.status === "published" ? serverTimestamp() : null,
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateBlogPostInput): Promise<void> {
    const data: Record<string, unknown> = { ...input };
    if (input.status === "published") data.publishedAt = serverTimestamp();
    await updateDoc(doc(db, "posts", id), data);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "posts", id));
  },

  async setStatus(id: string, status: BlogPostStatus): Promise<void> {
    const data: Record<string, unknown> = { status };
    if (status === "published") data.publishedAt = serverTimestamp();
    await updateDoc(doc(db, "posts", id), data);
  },

  async setFeatured(id: string, featured: boolean): Promise<void> {
    await updateDoc(doc(db, "posts", id), { featured });
  },
};
