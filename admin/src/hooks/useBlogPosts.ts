import { useEffect, useState, useCallback } from "react";
import { firestoreBlogPostRepository } from "@/infrastructure";
import { getBlogPosts } from "@/application/use-cases/blog/get-blog-posts";
import { createBlogPost } from "@/application/use-cases/blog/create-blog-post";
import { updateBlogPost } from "@/application/use-cases/blog/update-blog-post";
import { deleteBlogPost } from "@/application/use-cases/blog/delete-blog-post";
import { setBlogPostStatus } from "@/application/use-cases/blog/set-post-status";
import { setPostFeatured } from "@/application/use-cases/blog/set-post-featured";
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput, BlogPostStatus } from "@/domain/entities/blog-post.entity";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts(firestoreBlogPostRepository);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar artículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const ensureOnlyOneFeatured = useCallback(async (currentId?: string) => {
    const other = posts.find((p) => p.featured && p.id !== currentId);
    if (other) {
      await setPostFeatured(firestoreBlogPostRepository, other.id, false);
    }
  }, [posts]);

  const create = useCallback(async (input: CreateBlogPostInput) => {
    if (input.featured) await ensureOnlyOneFeatured();
    await createBlogPost(firestoreBlogPostRepository, input);
    await fetchPosts();
  }, [fetchPosts, ensureOnlyOneFeatured]);

  const update = useCallback(async (id: string, input: UpdateBlogPostInput) => {
    if (input.featured) await ensureOnlyOneFeatured(id);
    await updateBlogPost(firestoreBlogPostRepository, id, input);
    await fetchPosts();
  }, [fetchPosts, ensureOnlyOneFeatured]);

  const remove = useCallback(async (id: string) => {
    await deleteBlogPost(firestoreBlogPostRepository, id);
    await fetchPosts();
  }, [fetchPosts]);

  const toggleStatus = useCallback(async (id: string, current: BlogPostStatus) => {
    const next: BlogPostStatus = current === "published" ? "draft" : "published";
    await setBlogPostStatus(firestoreBlogPostRepository, id, next);
    await fetchPosts();
  }, [fetchPosts]);

  const toggleFeatured = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    if (next) await ensureOnlyOneFeatured(id);
    await setPostFeatured(firestoreBlogPostRepository, id, next);
    await fetchPosts();
  }, [fetchPosts, ensureOnlyOneFeatured]);

  return { posts, loading, error, refetch: fetchPosts, create, update, remove, toggleStatus, toggleFeatured };
}
