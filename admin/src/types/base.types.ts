import type { Timestamp } from "firebase/firestore";

/**
 * Timestamp nativo de Firestore (SDK cliente).
 */
export type FS = Timestamp;

/**
 * Representación serializada de un Firestore Timestamp.
 */
export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Acepta Timestamp nativo o serializado.
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
