/**
 * Unsigned upload to Cloudinary via the REST API.
 * Only uses VITE_CLOUDINARY_* env vars — safe for the client.
 */
export async function uploadImageToCloudinary(file: File, folder = "vous/blog"): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error("Faltan variables de entorno: VITE_CLOUDINARY_CLOUD_NAME y/o VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(errData?.error?.message ?? `Error al subir imagen (${res.status})`);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
