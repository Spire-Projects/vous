"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { PostCard } from "@/components/revista/PostCard";

export function RevistaTeaser() {
  const { posts, loading, error } = useBlogPosts();

  if (loading || error || posts.length === 0) {
    return null;
  }

  const preview = posts.slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-24 border-t border-black/5">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3 block">
              Editorial
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-black">vous news</h2>
          </div>
          <Link
            href="/revista"
            className="inline-flex items-center gap-1 font-nav text-[11px] uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            Ver todos los artículos <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {preview.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
