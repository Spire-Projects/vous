import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";

export async function deleteBlogPost(
  repo: BlogPostRepository,
  id: string
): Promise<void> {
  return repo.delete(id);
}
