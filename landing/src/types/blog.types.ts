import type { BaseDocument } from "./base.types";

// ── Colección: blogPosts ────────────────────────────────────────────────────

export type BlogPostStatus = "draft" | "published";

/**
 * Publicación del blog / revista editorial.
 * Ruta: blogPosts/{postId}
 */
export interface BlogPost extends BaseDocument {
  title: string;
  /** URL amigable, ej: "tendencias-urbanas-2026" */
  slug: string;
  /** Resumen corto para listados y SEO */
  excerpt?: string;
  /** Contenido completo (rich text / HTML) */
  content: string;
  /** URL de imagen principal en Cloudinary */
  coverImage?: string;
  /** Imágenes adicionales del artículo */
  images?: string[];
  /** Artículo fijado / destacado en la portada del blog */
  isFeatured: boolean;
  status: BlogPostStatus;
  tags?: string[];
  /** UID del admin autor */
  authorId: string;
  /** Snapshot del nombre del autor */
  authorName: string;
  /** null mientras sea draft */
  publishedAt?: import("./base.types").AnyTimestamp | null;
  /** Metadatos SEO individuales */
  seo?: {
    title?: string;
    description?: string;
  };
}

export type CreateBlogPostPayload = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;
