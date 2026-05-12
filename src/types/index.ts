// Barrel export — agrega aquí los exports de las interfaces y tipos TypeScript
// Ejemplo: export type { Producto } from './producto';

// ── Tipos globales de VOUS ──────────────────────────────────────────────────

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
