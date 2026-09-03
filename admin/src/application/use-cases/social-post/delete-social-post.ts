import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";

export async function deleteSocialPost(repo: SocialPostRepository, id: string) {
  return repo.delete(id);
}
