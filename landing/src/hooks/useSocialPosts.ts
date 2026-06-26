import { useEffect, useState } from "react";
import { firestoreSocialPostRepository } from "@/infrastructure";

export interface SocialPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  platform: "instagram" | "tiktok" | "youtube" | "facebook";
  thumbnailUrl: string;
  images: string[];
  active: boolean;
  order: number;
  createdAt: string;
}

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await firestoreSocialPostRepository.findAllActive();
        if (!cancelled) setPosts(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}
