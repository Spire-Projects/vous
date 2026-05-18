import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

export async function getFeaturedPosts(repo: BlogPostRepository): Promise<BlogPost[]> {
  return repo.findFeatured();
}
