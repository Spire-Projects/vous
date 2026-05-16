import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";

export async function setPostFeatured(
  repo: BlogPostRepository,
  id: string,
  featured: boolean
): Promise<void> {
  return repo.setFeatured(id, featured);
}
