import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPost, CreateBlogPostInput } from "@/domain/entities/blog-post.entity";

export async function createBlogPost(
  repo: BlogPostRepository,
  input: CreateBlogPostInput
): Promise<BlogPost> {
  return repo.create(input);
}
