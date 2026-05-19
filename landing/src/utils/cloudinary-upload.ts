import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary.client";

/**
 * Upload a file (image or PDF) to Cloudinary from the browser.
 * Uses unsigned upload preset (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).
 */
export async function uploadFileToCloudinary(
  file: File,
  folder = "vous/comprobantes"
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Faltan variables de entorno: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y/o NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    );
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("El archivo supera el tamaño máximo permitido de 5MB.");
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Solo se aceptan archivos JPG, PNG o PDF.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  // PDFs and other raw files need resource_type=auto
  const resourceType = file.type === "application/pdf" ? "raw" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(errData?.error?.message ?? `Error al subir el archivo (${res.status})`);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
