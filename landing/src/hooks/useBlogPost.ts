"use client";

import { useEffect, useState } from "react";
import { firestoreBlogPostRepository } from "@/infrastructure/repositories/firestore-blog-post.repository";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    firestoreBlogPostRepository
      .findBySlug(slug)
      .then((p) => {
        setPost(p);
      })
      .catch(() => setError("Error al cargar el artículo"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}
