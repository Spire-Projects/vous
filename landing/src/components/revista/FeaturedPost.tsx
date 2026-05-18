import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/revista/${post.slug}`} className="group md:flex gap-10 mb-16 block">
      <div className="md:w-1/2 aspect-video overflow-hidden bg-vous-soft-black relative shrink-0 mb-6 md:mb-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a18] to-[#2a2015]" />
        )}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
        <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gold mb-2">
          {post.category}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-vous-soft-black leading-snug mb-4 group-hover:text-vous-gold transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans text-sm text-vous-gray leading-relaxed mb-6">{post.excerpt}</p>
        )}
        <p className="font-nav text-[10px] tracking-[0.12em] uppercase text-vous-gray">{date}</p>
      </div>
    </Link>
  );
}
