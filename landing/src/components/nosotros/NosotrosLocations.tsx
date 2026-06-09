import { ExternalLink } from "lucide-react";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";

interface NosotrosLocationsProps {
  departmentLinks: DepartmentLink[];
  otherCountryLinks: DepartmentLink[];
}

export function NosotrosLocations({ departmentLinks, otherCountryLinks }: NosotrosLocationsProps) {
  return (
    <>
      {departmentLinks.length > 0 && (
        <section className="bg-vous-cream border-y border-vous-gray-light/40 py-12 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 md:px-20">
            <div className="mb-14 text-center">
              <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-3 block">
                Puntos Oficiales
              </span>
              <h2 className="font-serif text-[28px] md:text-[42px] text-vous-soft-black">
                Links por Departamento
              </h2>
              <p className="font-sans text-sm text-vous-gray mt-3">
                Compras por menor — tocá el departamento para ver la ubicación GPS.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentLinks.map((dept) => (
                <a
                  key={dept.name}
                  href={dept.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-vous-gray-light/50 p-5 flex items-center justify-between hover:border-vous-gold transition-colors"
                >
                  <span className="font-nav text-[12px] uppercase tracking-[0.15em] text-vous-soft-black group-hover:text-vous-gold transition-colors">
                    {dept.name}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-vous-gray group-hover:text-vous-gold transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {otherCountryLinks.length > 0 && (
        <section className="py-12 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 md:px-20">
            <div className="mb-14 text-center">
              <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-3 block">
                Distribuidores Oficiales
              </span>
              <h2 className="font-serif text-[28px] md:text-[42px] text-vous-soft-black">
                Otros Países
              </h2>
              <p className="font-sans text-sm text-vous-gray mt-3">
                Venta por mayor al exterior — distribuidores oficiales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {otherCountryLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.tiktokUrl || link.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-vous-gray-light/50 p-5 flex items-center justify-between hover:border-vous-gold transition-colors"
                >
                  <span className="font-nav text-[12px] uppercase tracking-[0.15em] text-vous-soft-black group-hover:text-vous-gold transition-colors">
                    {link.name}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-vous-gray group-hover:text-vous-gold transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
