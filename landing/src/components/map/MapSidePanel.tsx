import { MapPin, ExternalLink } from "lucide-react";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";

interface MapSidePanelProps {
  deptName: string;
  links: DepartmentLink[];
  onSelectLink?: (link: DepartmentLink) => void;
  editable?: boolean;
}

export function MapSidePanel({ deptName, links, onSelectLink, editable }: MapSidePanelProps) {
  if (!deptName) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
        <MapPin size={40} className="text-black/40 mb-4" strokeWidth={1} />
        <h3 className="font-serif text-lg text-black mb-2">Selecciona un departamento</h3>
        <p className="font-sans text-xs text-black/50 max-w-[220px]">
          Haz clic en cualquier departamento del mapa para ver las tiendas oficiales disponibles.
        </p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
        <MapPin size={40} className="text-black/40 mb-4" strokeWidth={1} />
        <h3 className="font-serif text-lg text-black mb-2">{deptName}</h3>
        <p className="font-sans text-xs text-black/50 max-w-[220px]">
          No hay tiendas registradas en este departamento.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-2 border-b border-black/10">
        <h3 className="font-serif text-lg text-black flex items-center gap-2">
          <MapPin size={18} className="text-black" />
          Tiendas en {deptName}
        </h3>
        <p className="font-sans text-[11px] text-black/50 mt-1">
          {links.length} tienda{links.length > 1 ? "s" : ""} encontrada{links.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {links.map((link, idx) => (
          <div
            key={`store-${idx}`}
            className="bg-white/60 border border-black/10 rounded-xl p-3 space-y-2 hover:border-black/50 transition-colors"
            onClick={() => onSelectLink?.(link)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-nav text-[11px] uppercase tracking-wide text-black truncate">
                  {link.name || "Tienda oficial"}
                </p>
                {editable && link.lat != null && link.lng != null && (
                  <p className="font-sans text-[10px] text-black/50 mt-0.5">
                    {link.lat.toFixed(4)}, {link.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <span className="font-sans text-[10px] text-black bg-black/10 px-1.5 py-0.5 rounded shrink-0">
                #{idx + 1}
              </span>
            </div>

            {(link.googleMapsUrl || link.tiktokUrl) && (
              <div className="flex flex-col gap-1">
                {link.googleMapsUrl && (
                  <a
                    href={link.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black text-[11px] font-sans hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={11} />
                    Ver en Google Maps
                  </a>
                )}
                {link.tiktokUrl && (
                  <a
                    href={link.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black text-[11px] font-sans hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={11} />
                    Ver en TikTok
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
