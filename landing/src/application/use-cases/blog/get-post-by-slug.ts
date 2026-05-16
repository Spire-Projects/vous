import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

export async function getPostBySlug(
  repo: BlogPostRepository,
  slug: string
): Promise<BlogPost | null> {
  return repo.findBySlug(slug);
}
