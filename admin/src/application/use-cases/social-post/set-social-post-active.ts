import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";

export async function setSocialPostActive(repo: SocialPostRepository, id: string, active: boolean) {
  return repo.setActive(id, active);
}
