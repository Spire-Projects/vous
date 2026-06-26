"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Video } from "lucide-react";
import { useSocialPosts } from "@/hooks/useSocialPosts";

export function NewPostTeaser() {
  const { posts, loading, error } = useSocialPosts();

  if (loading || error || posts.length === 0) {
    return null;
  }

  const preview = posts.slice(0, 3);

  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3 block">
              Redes Sociales
            </span>
            <h2 className="font-serif text-4xl md:text-5xl">
              New Post
            </h2>
          </div>
          <Link
            href="/nuevos-posts"
            className="inline-flex items-center gap-1 font-nav text-[11px] uppercase tracking-wider text-white/60 hover:text-white transition-colors"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((post) => (
            <a
              key={post.id}
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5 mb-4">
                {post.thumbnailUrl || (post.images && post.images[0]) ? (
                  <img
                    src={post.thumbnailUrl ?? post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video size={32} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-nav text-[11px] uppercase tracking-wider">
                    <ExternalLink size={12} />
                    Ver video
                  </span>
                </span>
              </div>
              <h3 className="font-nav text-[13px] font-semibold text-white mb-1">
                {post.title}
              </h3>
              <p className="font-sans text-sm text-white/50 line-clamp-2">
                {post.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
