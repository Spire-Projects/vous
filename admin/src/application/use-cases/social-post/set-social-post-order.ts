import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";

export async function setSocialPostOrder(repo: SocialPostRepository, id: string, order: number) {
  return repo.setOrder(id, order);
}
