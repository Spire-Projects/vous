import type { BlogPostRepository } from "@/domain/repositories/blog-post.repository";
import type { UpdateBlogPostInput } from "@/domain/entities/blog-post.entity";

export async function updateBlogPost(
  repo: BlogPostRepository,
  id: string,
  input: UpdateBlogPostInput
): Promise<void> {
  return repo.update(id, input);
}
