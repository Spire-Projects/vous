// Barrel export — agrega aquí los exports de las interfaces y tipos TypeScript
// Ejemplo: export type { Producto } from './producto';

// ── Tipos globales de VOUS ──────────────────────────────────────────────────

/**
 * Representación serializada de un Firestore Timestamp (plain object).
 * Úsala para datos ya leídos de Firestore y convertidos a JSON.
 * Para el tipo nativo del SDK, importa `Timestamp` desde `firebase/firestore`.
 */
export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface BaseDocument {
  id: string;
  createdAt: SerializedTimestamp;
  updatedAt: SerializedTimestamp;
}
