import type { BaseDocument, AnyTimestamp } from "./base.types";

export type BlogPostStatus = "draft" | "published";

/**
 * Publicación del blog. Ruta: blogPosts/{postId}
 */
export interface BlogPost extends BaseDocument {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  images?: string[];
  isFeatured: boolean;
  status: BlogPostStatus;
  tags?: string[];
  authorId: string;
  authorName: string;
  publishedAt?: AnyTimestamp | null;
  seo?: {
    title?: string;
    description?: string;
  };
}

export type CreateBlogPostPayload = Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;
