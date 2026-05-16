import type { SiteConfigRepository } from "@/domain/repositories/site-config.repository";
import type { UpdateSiteConfigInput } from "@/domain/entities/site-config.entity";

export async function updateSiteConfig(repo: SiteConfigRepository, input: UpdateSiteConfigInput): Promise<void> {
  return repo.update(input);
}
