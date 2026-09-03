/**
 * BlogPost entity — dominio puro sin dependencias de framework.
 */
export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
  featured: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  publishedAt: string | null;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
  featured: boolean;
  authorId: string;
  authorName: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;
