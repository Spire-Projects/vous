/**
 * SocialPost entity — posts/videos from social networks (NEW POST section).
 */
export type SocialPostPlatform = "instagram" | "tiktok" | "youtube" | "facebook";

export interface SocialPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  platform: SocialPostPlatform;
  thumbnailUrl: string;
  active: boolean;
  order: number;
  createdAt: string;
}
