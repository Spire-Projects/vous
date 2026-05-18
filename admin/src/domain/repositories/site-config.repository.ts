import type { SiteConfig, UpdateSiteConfigInput } from "@/domain/entities/site-config.entity";

export interface SiteConfigRepository {
  get(): Promise<SiteConfig | null>;
  update(input: UpdateSiteConfigInput): Promise<void>;
}
