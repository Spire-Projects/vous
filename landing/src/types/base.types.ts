import type { Timestamp } from "firebase/firestore";

/**
 * Timestamp nativo de Firestore (SDK cliente).
 * Úsalo en operaciones de escritura y lectura directa con el SDK.
 */
export type FS = Timestamp;

/**
 * Representación serializada de un Firestore Timestamp.
 * Úsala cuando los datos ya fueron convertidos a JSON (SSR / API routes).
 */
export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Acepta Timestamp nativo o serializado.
 * Útil para componentes que pueden recibir datos de ambas fuentes.
 */
export type AnyTimestamp = FS | SerializedTimestamp;

/**
 * Campos base presentes en todos los documentos de Firestore.
 */
export interface BaseDocument {
  id: string;
  createdAt: AnyTimestamp;
  updatedAt: AnyTimestamp;
}
