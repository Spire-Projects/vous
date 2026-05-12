import "server-only";

import { v2 as cloudinary } from "cloudinary";

const REQUIRED_VARS = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `[Cloudinary] Faltan variables de entorno requeridas: ${missing.join(", ")}. "
    + "Copia .env.example a .env.local y completa los valores.`
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Nombre del upload preset configurado en Cloudinary Dashboard.
 * Se usa en uploads desde el cliente (unsigned).
 */
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ?? "";
