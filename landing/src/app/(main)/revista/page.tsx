"use client";

import { useBlogPosts } from "@/hooks/useBlogPosts";
import { FeaturedPost } from "@/components/revista/FeaturedPost";
import { PostCard } from "@/components/revista/PostCard";

export default function RevistaPage() {
  const { posts, featured, loading, error } = useBlogPosts();

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-black py-14 md:py-20 px-5 md:px-20">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-black uppercase mb-3">
              Editorial
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
              Revista VOUS
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
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-black uppercase mb-3">
              Editorial
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
              Revista VOUS
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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-black py-14 md:py-20 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-black uppercase mb-3">
            Editorial
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4">
            Revista VOUS
          </h1>
          <p className="font-sans text-sm text-white/60 max-w-md leading-relaxed">
            Historias, tendencias y el proceso detrás de cada colección.
          </p>
        </div>
      </div>

      {/* Posts */}
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
    </div>
  );
}
