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
  images: string[];
  active: boolean;
  order: number;
  createdAt: string;
}

export interface CreateSocialPostInput {
  title: string;
  description: string;
  videoUrl: string;
  platform: SocialPostPlatform;
  thumbnailUrl: string;
  images: string[];
  active: boolean;
  order: number;
}

export type UpdateSocialPostInput = Partial<CreateSocialPostInput>;
