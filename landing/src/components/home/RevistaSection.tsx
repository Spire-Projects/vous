"use client";

import Link from "next/link";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { FeaturedPost } from "@/components/revista/FeaturedPost";
import { PostCard } from "@/components/revista/PostCard";
import { Button } from "@/components/ui/button";

export function RevistaSection() {
  const { posts, featured, loading, error } = useBlogPosts();

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

  const featuredPost = featured ?? posts[0];
  const otherPosts = posts.filter((p) => p.id !== featuredPost.id).slice(0, 3);

  return (
    <section className="bg-white py-20 md:py-28 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-14">
          <p className="font-nav text-[11px] tracking-[0.25em] text-black uppercase mb-3">
            Editorial
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-black">vous news</h2>
          <p className="font-sans text-sm text-black/50 mt-3 max-w-md leading-relaxed">
            Historias, tendencias y el proceso detrás de cada colección.
          </p>
        </div>

        <FeaturedPost post={featuredPost} />

        {otherPosts.length > 0 && (
          <div className="border-t border-black/10 pt-14 mt-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/revista">Ver todos los artículos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
