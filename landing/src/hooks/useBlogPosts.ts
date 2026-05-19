"use client";

import { useEffect, useState } from "react";
import { firestoreBlogPostRepository } from "@/infrastructure/repositories/firestore-blog-post.repository";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      firestoreBlogPostRepository.findPublished(),
      firestoreBlogPostRepository.findFeatured(),
    ])
      .then(([published, featuredList]) => {
        setPosts(published);
        setFeatured(featuredList[0] ?? null);
      })
      .catch((err) => {
        console.error("Error cargando blog posts:", err);
        setError("No se pudieron cargar los artículos. Intenta de nuevo más tarde.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { posts, featured, loading, error };
}
