"use client";

import Link from "next/link";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { FeaturedPost } from "@/components/revista/FeaturedPost";
import { PostCard } from "@/components/revista/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function RevistaPage() {
  const { posts, featured, loading, error } = useBlogPosts();

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-black py-14 md:py-20 px-5 md:px-20">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-white uppercase mb-3">
              Editorial
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
              Blog de Moda
            </h1>
          </div>
        </div>
        <div className="flex justify-center py-24">
          <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-black py-14 md:py-20 px-5 md:px-20">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-white uppercase mb-3">
              Editorial
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
              Blog de Moda
            </h1>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-24 text-center">
          <p className="font-sans text-sm text-black/50">
            No se pudieron cargar los artículos. Intenta de nuevo más tarde.
          </p>
        </div>
      </div>
    );
  }

  const featuredPost = featured ?? posts[0] ?? null;
  const otherPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/15 blur-3xl" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Editorial VOUS
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                Blog de Moda
              </h1>
              <p className="font-sans text-base text-white/60 max-w-xl leading-relaxed">
                Historias, tendencias y el proceso detrás de cada colección.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <div className="inline-flex items-center gap-3 border border-white/15 rounded-full px-5 py-2.5">
                <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-white/70">
                  {posts.length} artículo{posts.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-14 md:py-20">
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {otherPosts.length > 0 && (
          <div className="border-t border-black/10 pt-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-sans text-sm text-black/50">
              Próximamente publicaciones editoriales.
            </p>
          </div>
        )}
      </div>

      {/* Editorial CTA */}
      <section className="bg-black text-white py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block">
                Inspírate
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-5">
                Lee, inspírate y lleva el estilo a tu clóset
              </h2>
              <p className="font-sans text-base text-white/60 max-w-md leading-relaxed">
                Explora el catálogo y descubre las prendas que protagonizan nuestros artículos.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3">
              <Button asChild className="bg-white text-black hover:bg-white/90 font-nav text-[11px] uppercase tracking-wider">
                <Link href="/catalogo">
                  Ir al catálogo <ArrowRight size={14} className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline-white" className="font-nav text-[11px] uppercase tracking-wider">
                <Link href="/nuevos-posts">
                  Ver new post
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
