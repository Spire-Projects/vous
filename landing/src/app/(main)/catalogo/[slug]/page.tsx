import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { ProductGallery } from "@/components/producto/ProductGallery";
import { ProductInfo } from "@/components/producto/ProductInfo";
import { RelatedProducts } from "@/components/producto/RelatedProducts";

interface ProductoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await firestoreProductRepository.findAll();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await firestoreProductRepository.findBySlug(slug);
  if (!product) return { title: "Producto no encontrado — VOUS" };

  const image = product.images[0] ?? "";
  return {
    title: `${product.name} — VOUS`,
    description: product.description || product.detail,
    openGraph: {
      title: product.name,
      description: product.description || product.detail,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await firestoreProductRepository.findBySlug(slug);
  if (!product) notFound();

  const related = (await firestoreProductRepository.findByCategory(product.categoryId))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 mb-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
