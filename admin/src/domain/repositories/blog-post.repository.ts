import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostStatus } from "@/domain/entities/blog-post.entity";

export interface BlogPostRepository {
  findAll(): Promise<BlogPost[]>;
  findById(id: string): Promise<BlogPost | null>;
  create(input: CreateBlogPostInput): Promise<BlogPost>;
  update(id: string, input: UpdateBlogPostInput): Promise<void>;
  delete(id: string): Promise<void>;
  setStatus(id: string, status: BlogPostStatus): Promise<void>;
  setFeatured(id: string, featured: boolean): Promise<void>;
}
