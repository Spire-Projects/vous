"use client";

import Link from "next/link";
import { useSocialPosts } from "@/hooks/useSocialPosts";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink } from "lucide-react";

export function SocialPostsSection() {
  const { posts, loading, error } = useSocialPosts();

  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto flex justify-center">
          <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 md:py-28 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-14">
          <p className="font-nav text-[11px] tracking-[0.25em] text-black uppercase mb-3">
            Redes Sociales
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-black">New Post</h2>
          <p className="font-sans text-sm text-black/50 mt-3 max-w-md leading-relaxed">
            Nuestros últimos videos y posts en redes sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="group">
              <div className="relative aspect-video overflow-hidden bg-black/5 mb-4">
                {post.images && post.images.length > 0 ? (
                  <ImageCarousel
                    images={post.images}
                    alt={post.title}
                    aspect="video"
                    interval={2000}
                    showDots
                    pauseOnHover
                    className="w-full h-full"
                  />
                ) : post.thumbnailUrl ? (
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

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/nuevos-posts">Ver todos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
