import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { BlogPostStatus } from "@/domain/entities/blog-post.entity";

export async function setBlogPostStatus(
  repo: BlogPostRepository,
  id: string,
  status: BlogPostStatus
): Promise<void> {
  return repo.setStatus(id, status);
}
