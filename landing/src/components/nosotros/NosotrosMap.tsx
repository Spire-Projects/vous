"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  BOLIVIA_DEPARTMENTS,
  DEPT_ID_TO_NAME,
  DEPT_CENTERS,
} from "@/data/bolivia-departments";
import type { DepartmentLink } from "@/domain/entities/site-config.entity";
import { MapSidePanel } from "@/components/map/MapSidePanel";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [-16.5, -64.5];
const DEFAULT_ZOOM = 6;

const blackDotIcon = L.divIcon({
  className: "black-dot",
  html: `<div style="width:14px;height:14px;background:#000000;border-radius:50%;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -7],
});

function resolveDeptId(name: string): string {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function markerPosition(link: DepartmentLink): [number, number] | null {
  if (link.lat != null && link.lng != null) {
    return [link.lat, link.lng];
  }
  const match = link.googleMapsUrl.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

function FitBounds({ selectedDept }: { selectedDept: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedDept || !DEPT_CENTERS[selectedDept]) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
      return;
    }
    const [lng, lat] = DEPT_CENTERS[selectedDept];
    map.setView([lat, lng], 8, { animate: true });
  }, [map, selectedDept]);
  return null;
}

function geoJSONStyle(
  feature: { properties: { name: string } } | undefined,
  selectedDept: string | null
) {
  if (!feature) return {};
  const deptId = resolveDeptId(feature.properties.name);
  const isSelected = deptId === selectedDept;
  return {
    fillColor: isSelected ? "#000000" : "#000000",
    fillOpacity: isSelected ? 0.30 : 0.08,
    color: isSelected ? "#000000" : "#000000",
    weight: isSelected ? 2.5 : 1,
    dashArray: isSelected ? "" : "3 3",
  };
}

interface NosotrosMapProps {
  departmentLinks: DepartmentLink[];
  otherCountryLinks: DepartmentLink[];
}

export function NosotrosMap({ departmentLinks, otherCountryLinks }: NosotrosMapProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const onEachFeature = useCallback(
    (feature: { properties: { name: string } }, layer: L.Layer) => {
      layer.on({
        click: () => {
          const deptId = resolveDeptId(feature.properties.name);
          setSelectedDept((prev) => (prev === deptId ? null : deptId));
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          const tgt = e.target as L.Path;
          if (resolveDeptId(feature.properties.name) !== selectedDept) {
            tgt.setStyle({ fillOpacity: 0.20, weight: 2 });
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const tgt = e.target as L.Path;
          const isSel = resolveDeptId(feature.properties.name) === selectedDept;
          tgt.setStyle({
            fillOpacity: isSel ? 0.30 : 0.08,
            weight: isSel ? 2.5 : 1,
          });
        },
      });
    },
    [selectedDept]
  );

  const selectedDeptName = selectedDept
    ? (DEPT_ID_TO_NAME[selectedDept] ?? "")
    : "";

  const selectedLinks = useMemo(() => {
    if (!selectedDeptName) return [];
    return departmentLinks.filter(
      (link) =>
        link.name.toLowerCase().trim() === selectedDeptName.toLowerCase().trim()
    );
  }, [departmentLinks, selectedDeptName]);

  const allLinks = useMemo(() => {
    return [...departmentLinks, ...otherCountryLinks];
  }, [departmentLinks, otherCountryLinks]);

  return (
    <div className="flex flex-col lg:flex-row gap-3" style={{ minHeight: 500 }}>
      {/* Mapa */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-black/10" style={{ minHeight: 500 }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", minHeight: 500 }}
          attributionControl={false}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
          <GeoJSON
            key={selectedDept ?? "none"}
            data={BOLIVIA_DEPARTMENTS}
            style={(feature) => geoJSONStyle(feature, selectedDept)}
            onEachFeature={onEachFeature}
          />
          {/* Todos los marcadores */}
          {allLinks.map((link, idx) => {
            const pos = markerPosition(link);
            if (!pos) return null;
            return (
              <Marker key={`marker-${idx}`} position={pos} icon={blackDotIcon}>
                <Popup>
                  <div className="font-sans text-xs space-y-1 min-w-[150px]">
                    <p className="font-nav text-[11px] uppercase tracking-wide text-black font-semibold">
                      {link.name || "Tienda oficial"}
                    </p>
                    {link.googleMapsUrl && (
                      <a
                        href={link.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline text-[11px] block"
                      >
                        Abrir en Google Maps
                      </a>
                    )}
                    {link.tiktokUrl && (
                      <a
                        href={link.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline text-[11px] block"
                      >
                        Abrir en TikTok
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          <FitBounds selectedDept={selectedDept} />
        </MapContainer>
      </div>

      {/* Panel de tiendas */}
      <div className="w-full lg:w-80 bg-white border border-black/10 rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ minHeight: 200 }}>
        <MapSidePanel deptName={selectedDeptName} links={selectedLinks} />
      </div>
    </div>
  );
}
