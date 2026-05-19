import type { Metadata } from "next";
import { BlogPostClient } from "./BlogPostClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params);
  return {
    title: `${slug.replace(/-/g, " ")} | Revista VOUS`,
    description: "Revista VOUS — moda, tendencias y el proceso detrás de cada colección.",
  };
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
