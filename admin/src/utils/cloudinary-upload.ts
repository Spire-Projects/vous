/**
 * Unsigned upload to Cloudinary via the REST API.
 * Only uses VITE_CLOUDINARY_* env vars — safe for the client.
 */
export async function uploadImageToCloudinary(file: File, folder = "vous/blog"): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
