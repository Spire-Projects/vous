import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostStatus } from "@/domain/entities/blog-post.entity";

export interface BlogPostRepository {
  findPublished(): Promise<BlogPost[]>;
  findFeatured(): Promise<BlogPost[]>;
  findBySlug(slug: string): Promise<BlogPost | null>;
}

export type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostStatus };
