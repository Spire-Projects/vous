import type { WholesaleRequestStatus } from "@/domain/entities/wholesale.entity";
import type { BadgeProps } from "@/components/ui/badge";

export const STATUS_VARIANT: Record<WholesaleRequestStatus, BadgeProps["variant"]> = {
  pending: "pending",
  approved: "gold",
  rejected: "cancelled",
};

export const STATUS_LABEL: Record<WholesaleRequestStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

export const HOW_FOUND_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  tienda_fisica: "Tienda Física Cbba",
  recomendacion: "Me lo recomendaron",
};

export type FilterTab = "all" | "pending" | "approved" | "rejected";

export const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Aprobados", value: "approved" },
  { label: "Rechazados", value: "rejected" },
];

export function formatDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return "—";
}
