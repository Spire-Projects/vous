import { useState, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useClothingConfig } from "@/hooks/useClothingConfig";
import { ConfigCrudTab } from "@/components/clothing-config";
import type { ConfigFormField } from "@/components/clothing-config";
import { Ruler, Palette, ListChecks, Tag } from "lucide-react";
import type { ClothingAttribute, ClothingBadge } from "@/domain/entities/clothing-config.entity";

type TabId = "sizes" | "materials" | "attributes" | "badges";

const TABS: { id: TabId; label: string; icon: React.ElementType; description: string }[] = [
  { id: "sizes", label: "Tallas", icon: Ruler, description: "XS, S, M, L, XL…" },
  { id: "materials", label: "Materiales", icon: Palette, description: "Algodón, Lana…" },
  { id: "attributes", label: "Atributos", icon: ListChecks, description: "Corte, tela…" },
  { id: "badges", label: "Etiquetas", icon: Tag, description: "Badges especiales" },
];

const SIZE_FIELDS: ConfigFormField[] = [
  { key: "name", label: "Nombre de la talla", type: "text", required: true },
];

const MATERIAL_FIELDS: ConfigFormField[] = [
  { key: "name", label: "Nombre del material", type: "text", required: true },
];

const ATTRIBUTE_FIELDS: ConfigFormField[] = [
  { key: "name", label: "Nombre del atributo", type: "text", required: true },
  { key: "label", label: "Etiqueta visible", type: "text", required: true },
];

const BADGE_FIELDS: ConfigFormField[] = [
  { key: "name", label: "Nombre de la etiqueta", type: "text", required: true },
  { key: "color", label: "Color", type: "color", required: true },
];

export function ClothingConfigPage() {
  const {
    sizes, materials, attributes, badges,
    loading, error,
    createSize, updateSize, removeSize, reorderSizes,
    createMaterial, updateMaterial, removeMaterial, reorderMaterials,
    createAttribute, updateAttribute, removeAttribute, reorderAttributes,
    createBadge, updateBadge, removeBadge, reorderBadges,
  } = useClothingConfig();

  const [activeTab, setActiveTab] = useState<TabId>("sizes");
  const [visited, setVisited] = useState<Set<TabId>>(new Set(["sizes"]));

  const switchTab = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    setVisited((prev) => new Set(prev).add(tabId));
  }, []);

  const counts = {
    sizes: { total: sizes.length, active: sizes.filter((i) => i.isActive).length },
    materials: { total: materials.length, active: materials.filter((i) => i.isActive).length },
    attributes: { total: attributes.length, active: attributes.filter((i) => i.isActive).length },
    badges: { total: badges.length, active: badges.filter((i) => i.isActive).length },
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader
          title="Configuración de Ropa"
          subtitle="Gestiona tallas, materiales, atributos y etiquetas para los productos."
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vous-gold" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader
          title="Configuración de Ropa"
          subtitle="Gestiona tallas, materiales, atributos y etiquetas para los productos."
        />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <PageHeader
        title="Configuración de Ropa"
        subtitle="Gestiona tallas, materiales, atributos y etiquetas para los productos."
      />

      {/* Tabs tipo tarjetas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {TABS.map(({ id, label, icon: Icon, description }) => {
          const isActive = activeTab === id;
          const count = counts[id].total;
          const activeCount = counts[id].active;
          return (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`relative text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 group ${
                isActive
                  ? "bg-white/90 border-vous-gold/40 shadow-lg shadow-amber-500/10 ring-1 ring-vous-gold/20"
                  : "bg-white/40 border-white/50 hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl transition-colors ${isActive ? "bg-vous-gold/15 text-vous-gold" : "bg-black/5 text-vous-text-secondary group-hover:bg-black/10"}`}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                {isActive && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-vous-gold/15 text-vous-gold text-[10px] font-bold font-nav">
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className={`font-nav text-sm font-semibold tracking-wide ${isActive ? "text-vous-text" : "text-vous-text-secondary group-hover:text-vous-text"}`}>
                  {label}
                </p>
                <p className="text-[11px] text-vous-text-secondary mt-0.5 font-sans">
                  {count} {count === 1 ? "registro" : "registros"} · {description}
                </p>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-vous-gold rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-4 sm:p-6 lg:p-8">
        {activeTab === "sizes" && visited.has("sizes") && (
          <ConfigCrudTab
            title="Tallas disponibles"
            subtitle="Escribe cada talla y presiona Enter. Si el producto no tiene tallas, deja este campo vacío."
            items={sizes}
            fields={SIZE_FIELDS}
            onCreate={(data) => createSize({
              name: String(data.name),
              sortOrder: Number(data.sortOrder),
              isActive: !!data.isActive,
            })}
            onUpdate={(id, data) => updateSize(id, {
              name: data.name !== undefined ? String(data.name) : undefined,
              sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
              isActive: data.isActive !== undefined ? !!data.isActive : undefined,
            })}
            onRemove={removeSize}
            onToggleActive={(id, active) => updateSize(id, { isActive: active })}
            onReorder={reorderSizes}
          />
        )}

        {activeTab === "materials" && visited.has("materials") && (
          <ConfigCrudTab
            title="Materiales"
            subtitle="Algodón, Lana, Poliéster… Define los materiales disponibles para los productos."
            items={materials}
            fields={MATERIAL_FIELDS}
            onCreate={(data) => createMaterial({
              name: String(data.name),
              sortOrder: Number(data.sortOrder),
              isActive: !!data.isActive,
            })}
            onUpdate={(id, data) => updateMaterial(id, {
              name: data.name !== undefined ? String(data.name) : undefined,
              sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
              isActive: data.isActive !== undefined ? !!data.isActive : undefined,
            })}
            onRemove={removeMaterial}
            onToggleActive={(id, active) => updateMaterial(id, { isActive: active })}
            onReorder={reorderMaterials}
          />
        )}

        {activeTab === "attributes" && visited.has("attributes") && (
          <ConfigCrudTab<ClothingAttribute>
            title="Atributos"
            subtitle="Corte, tela, pretina, largo… Define los atributos personalizados de los productos."
            items={attributes}
            fields={ATTRIBUTE_FIELDS}
            extraColumns={[
              { header: "Etiqueta visible", render: (item) => item.label },
            ]}
            onCreate={(data) => createAttribute({
              name: String(data.name),
              label: String(data.label),
              sortOrder: Number(data.sortOrder),
              isActive: !!data.isActive,
            })}
            onUpdate={(id, data) => updateAttribute(id, {
              name: data.name !== undefined ? String(data.name) : undefined,
              label: data.label !== undefined ? String(data.label) : undefined,
              sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
              isActive: data.isActive !== undefined ? !!data.isActive : undefined,
            })}
            onRemove={removeAttribute}
            onToggleActive={(id, active) => updateAttribute(id, { isActive: active })}
            onReorder={reorderAttributes}
          />
        )}

        {activeTab === "badges" && visited.has("badges") && (
          <ConfigCrudTab<ClothingBadge>
            title="Etiqueta especial (Badge)"
            subtitle="Etiquetas que se muestran en los productos."
            items={badges}
            fields={BADGE_FIELDS}
            extraColumns={[
              {
                header: "Vista previa",
                render: (item) => (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-nav font-semibold uppercase tracking-wider rounded-xl border"
                    style={{
                      backgroundColor: item.color + "20",
                      color: item.color,
                      borderColor: item.color + "40",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                ),
              },
            ]}
            onCreate={(data) => createBadge({
              name: String(data.name),
              color: String(data.color),
              sortOrder: Number(data.sortOrder),
              isActive: !!data.isActive,
            })}
            onUpdate={(id, data) => updateBadge(id, {
              name: data.name !== undefined ? String(data.name) : undefined,
              color: data.color !== undefined ? String(data.color) : undefined,
              sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
              isActive: data.isActive !== undefined ? !!data.isActive : undefined,
            })}
            onRemove={removeBadge}
            onToggleActive={(id, active) => updateBadge(id, { isActive: active })}
            onReorder={reorderBadges}
          />
        )}
      </div>
    </div>
  );
}
