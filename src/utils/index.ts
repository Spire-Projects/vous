// Barrel export — agrega aquí los exports de helpers y funciones utilitarias
// Ejemplo: export { formatCurrency } from './formatCurrency';

/**
 * Formatea un valor numérico como precio en COP.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Trunca un texto a la longitud indicada agregando "…" si es necesario.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
