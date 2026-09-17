export function buildWhatsAppHref(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  const normalized = (message || "Hola, tengo una consulta").replace(/\r\n/g, "\n");
  const encoded = encodeURIComponent(normalized);
  return `https://wa.me/${clean}?text=${encoded}`;
}
