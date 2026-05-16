import type { SiteConfigRepository } from "@/domain/repositories/site-config.repository";
import type { SiteConfig } from "@/domain/entities/site-config.entity";

export async function getSiteConfig(repo: SiteConfigRepository): Promise<SiteConfig | null> {
  return repo.get();
}
