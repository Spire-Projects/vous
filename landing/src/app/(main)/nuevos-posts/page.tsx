"use client";

import Link from "next/link";
import { useSocialPosts } from "@/hooks/useSocialPosts";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, ArrowRight } from "lucide-react";

export default function NuevosPostsPage() {
  const { posts, loading, error } = useSocialPosts();

  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-96 h-96 rounded-full bg-[#C9A84C]/20 blur-3xl" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Redes Sociales · En Vivo
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">New Post</h1>
              <p className="font-sans text-base text-white/60 max-w-xl leading-relaxed">
                Nuestros últimos videos y posts en redes sociales. Conoce el detrás de cámara,
                campañas y más.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <div className="inline-flex items-center gap-3 border border-white/15 rounded-full px-5 py-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-white/70">
                  Recién publicados
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-16 md:py-24">
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
                <div className="relative overflow-hidden bg-black/5 mb-4 rounded-xl">
                  {post.images && post.images.length > 0 ? (
                    <ImageCarousel
                      images={post.images}
                      alt={post.title}
                      aspect="auto"
                      interval={2000}
                      showDots
                      pauseOnHover
                      className="w-full"
                    />
                  ) : post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center">
                      <Video size={32} className="text-black/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
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
                <h3 className="font-nav text-[13px] font-semibold text-black mb-1">{post.title}</h3>
                <p className="font-sans text-sm text-black/50 line-clamp-2">{post.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editorial CTA */}
      <section className="bg-black text-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                ¿Te gustó lo que viste?
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-5">
                Encuentra las prendas del video
              </h2>
              <p className="font-sans text-base text-white/60 max-w-md leading-relaxed">
                Saltá directo al catálogo y comprá las piezas que viste en nuestros posts.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3">
              <Button
                asChild
                className="bg-white text-black hover:bg-white/90 font-nav text-[11px] uppercase tracking-wider"
              >
                <Link href="/catalogo">
                  Ir al catálogo <ArrowRight size={14} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline-white"
                className="font-nav text-[11px] uppercase tracking-wider"
              >
                <Link href="/revista">Leer el blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
