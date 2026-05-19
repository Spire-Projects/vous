import type { Metadata } from "next";
import { ProductoPageClient } from "./ProductoPageClient";

/**
 * ISR: regenera la página en el servidor cada 60 s para reflejar
 * cambios de stock y precio sin necesidad de un rebuild completo.
 */
export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params);

  // Fetch server-side solo si las credenciales Firebase Admin están configuradas.
  // En local (sin FIREBASE_ADMIN_*) cae al fallback basado en slug.
  const product = await fetchProductServer(slug);

  const name =
    product?.name ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const description = product?.description || "Descubre esta pieza exclusiva en la colección VOUS.";

  const ogImage = product?.images?.[0];

  return {
    title: `${name} — VOUS`,
    description,
    openGraph: {
      title: `${name} — VOUS`,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 800, height: 1067, alt: name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — VOUS`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/** Fetch server-side vía Firebase Admin SDK (opcional, requiere FIREBASE_ADMIN_*) */
async function fetchProductServer(slug: string) {
  try {
    const hasAdminCreds =
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!hasAdminCreds) return null;

    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const db = getAdminDb();
    const snap = await db.collection("products").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return {
      name: data.name as string | undefined,
      description: data.description as string | undefined,
      images: data.images as string[] | undefined,
    };
  } catch {
    return null;
  }
}

export default function ProductoPage() {
  return <ProductoPageClient />;
}
