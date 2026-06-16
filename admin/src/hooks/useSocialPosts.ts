import { useEffect, useState, useCallback } from "react";
import { firestoreSocialPostRepository } from "@/infrastructure";
import { getSocialPosts } from "@/application/use-cases/social-post/get-social-posts";
import { createSocialPost } from "@/application/use-cases/social-post/create-social-post";
import { updateSocialPost } from "@/application/use-cases/social-post/update-social-post";
import { deleteSocialPost } from "@/application/use-cases/social-post/delete-social-post";
import { setSocialPostActive } from "@/application/use-cases/social-post/set-social-post-active";
import { setSocialPostOrder } from "@/application/use-cases/social-post/set-social-post-order";
import type { SocialPost, CreateSocialPostInput, UpdateSocialPostInput } from "@/domain/entities/social-post.entity";

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSocialPosts(firestoreSocialPostRepository);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const create = useCallback(async (input: CreateSocialPostInput) => {
    await createSocialPost(firestoreSocialPostRepository, input);
    await fetchPosts();
  }, [fetchPosts]);

  const update = useCallback(async (id: string, input: UpdateSocialPostInput) => {
    await updateSocialPost(firestoreSocialPostRepository, id, input);
    await fetchPosts();
  }, [fetchPosts]);

  const remove = useCallback(async (id: string) => {
    await deleteSocialPost(firestoreSocialPostRepository, id);
    await fetchPosts();
  }, [fetchPosts]);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await setSocialPostActive(firestoreSocialPostRepository, id, !current);
    await fetchPosts();
  }, [fetchPosts]);

  const reorder = useCallback(async (items: SocialPost[]) => {
    await Promise.all(
      items.map((p, idx) => setSocialPostOrder(firestoreSocialPostRepository, p.id, idx))
    );
    await fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts, create, update, remove, toggleActive, reorder };
}
