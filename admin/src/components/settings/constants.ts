import { Store, Phone, Share2, FileText, Clock, CreditCard, MapPin } from "lucide-react";
import type { ScheduleItem, ExtendedSchedule, DepartmentLink } from "@/domain/entities/site-config.entity";

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: "Lunes", hours: "" },
  { day: "Martes", hours: "" },
  { day: "Miércoles", hours: "" },
  { day: "Jueves", hours: "" },
  { day: "Viernes", hours: "" },
  { day: "Sábado", hours: "" },
  { day: "Domingo", hours: "" },
];

export function emptySchedule(title: string): ExtendedSchedule {
  return { title, days: DEFAULT_SCHEDULE.map((d) => ({ ...d })) };
}

export const DEFAULT_EXTENDED = [
  "Compras por Menor",
  "Compras por Mayor",
  "Envíos Compras por Mayor",
];

export const EMPTY_DEPT_LINK: DepartmentLink = { name: "", googleMapsUrl: "", tiktokUrl: "" };

export const TABS = [
  { id: "brand", label: "Identidad", icon: Store },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "social", label: "Redes", icon: Share2 },
  { id: "locations", label: "Ubicaciones", icon: MapPin },
  { id: "policies", label: "Políticas", icon: FileText },
  { id: "schedule", label: "Horarios", icon: Clock },
  { id: "payment", label: "Pagos", icon: CreditCard },
] as const;

export type TabId = (typeof TABS)[number]["id"];
