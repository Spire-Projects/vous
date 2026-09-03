/**
 * Convierte una URL directa de Cloudinary en una URL del proxy interno,
 * ocultando el cloud name al usuario final.
 *
 * En desarrollo devuelve la URL original para evitar dependencias del servidor.
 */
export function proxyCldUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return cloudinaryUrl;
  if (process.env.NODE_ENV === "development") return cloudinaryUrl;
  return `/api/image?url=${encodeURIComponent(cloudinaryUrl)}`;
}
