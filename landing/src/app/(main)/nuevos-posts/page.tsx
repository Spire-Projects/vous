"use client";

import Link from "next/link";
import { useSocialPosts } from "@/hooks/useSocialPosts";
import { ArrowLeft, Video, ExternalLink } from "lucide-react";

export default function NuevosPostsPage() {
  const { posts, loading, error } = useSocialPosts();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={12} /> Volver al inicio
        </Link>

        <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-4 block">
          Redes Sociales
        </span>
        <h1 className="font-serif text-[36px] md:text-[64px] leading-[1.08] text-black mb-8">
          New Post
        </h1>
        <p className="font-sans text-sm text-black/50 max-w-md leading-relaxed mb-12">
          Nuestros últimos videos y posts en redes sociales.
        </p>

        {loading && (
          <div className="flex justify-center py-24">
            <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="font-sans text-sm text-black/50">
              No se pudieron cargar los posts. Intenta de nuevo más tarde.
            </p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-sans text-sm text-black/50">
              No hay posts disponibles por el momento.
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="group">
                <div className="relative aspect-video overflow-hidden bg-black/5 mb-4">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={32} className="text-black/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <a
                    href={post.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-nav text-[11px] uppercase tracking-wider">
                      <ExternalLink size={12} />
                      Ver video
                    </span>
                  </a>
                </div>
                <h3 className="font-nav text-[13px] font-semibold text-black mb-1">
                  {post.title}
                </h3>
                <p className="font-sans text-sm text-black/50 line-clamp-2">
                  {post.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
