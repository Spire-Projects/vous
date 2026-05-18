import type { Metadata } from "next";
import { ProductoPageClient } from "./ProductoPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params);
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${name} — VOUS`,
    description: "Descubre esta pieza en la colección VOUS.",
  };
}

export default function ProductoPage() {
  return <ProductoPageClient />;
}
