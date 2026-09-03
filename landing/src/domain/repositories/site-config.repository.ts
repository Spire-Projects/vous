import type { SiteConfig } from "@/domain/entities/site-config.entity";

export interface SiteConfigRepository {
  get(): Promise<SiteConfig | null>;
}
