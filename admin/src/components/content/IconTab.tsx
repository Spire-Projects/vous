import { useState } from "react";
import { Plus, Trash2, Save, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { MultiImagePicker } from "@/components/shared/MultiImagePicker";
import { useInfluencers } from "@/hooks/useInfluencers";
import type { Influencer, CreateInfluencerInput } from "@/domain/entities/influencer.entity";

const EMPTY_FORM: CreateInfluencerInput = {
  name: "",
  imageUrl: "",
  images: [],
  instagramUrl: "",
  tiktokUrl: "",
  order: 0,
};

const DEFAULT_INFLUENCERS: CreateInfluencerInput[] = [
  {
    name: "Danny Beltran",
    imageUrl: "",
    images: [],
    instagramUrl: "https://www.instagram.com/danny.stylist_ba?igsh=eXhtcGtkczJiOGpi",
    tiktokUrl: "https://www.tiktok.com/@dani.stylebiz?_r=1&_t=ZS-96nb7RgOZVw",
    order: 1,
  },
  {
    name: "Romer Angola",
    imageUrl: "",
    images: [],
    instagramUrl: "https://www.instagram.com/rom_angola?igsh=MW5vcmJxc3ZhMDM4eQ==",
    tiktokUrl: "https://www.tiktok.com/@rom_angola?_r=1&_t=ZS-96nc04SS6lj",
    order: 2,
  },
  {
    name: "Sasha Vasquez",
    imageUrl: "",
    images: [],
    instagramUrl: "https://www.instagram.com/sashavasquez__?igsh=MW4wa3hxMXVvNjI0MA==",
    tiktokUrl: "https://www.tiktok.com/@sashavasquez__?_r=1&_t=ZS-96nbiu5EBxn",
    order: 3,
  },
];

function InfluencerForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: CreateInfluencerInput;
  onSave: (data: CreateInfluencerInput) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<CreateInfluencerInput>({ ...initial });

  const handleChange = (field: keyof CreateInfluencerInput, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-vous-text">
          {initial.name ? "Editar Influencer" : "Nuevo Influencer"}
        </h3>
        <button onClick={onCancel} className="text-vous-text-muted hover:text-vous-text transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px]">Nombre</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Danny Beltran" className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">Imagen principal</Label>
          <ImagePicker
            value={form.imageUrl}
            onChange={(url) => handleChange("imageUrl", url)}
            folder="vous/influencers"
            label="Subir foto del influencer"
            aspect="square"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-[11px]">Galería de imágenes</Label>
          <MultiImagePicker
            values={form.images ?? []}
            onChange={(urls) => handleChange("images", urls)}
            folder="vous/influencers"
            label="Agregar imagen"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">Instagram URL</Label>
          <Input value={form.instagramUrl} onChange={(e) => handleChange("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">TikTok URL</Label>
          <Input value={form.tiktokUrl} onChange={(e) => handleChange("tiktokUrl", e.target.value)} placeholder="https://tiktok.com/@..." className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">Orden</Label>
          <Input type="number" value={form.order} onChange={(e) => handleChange("order", parseInt(e.target.value, 10) || 0)} className="text-xs" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="text-xs">Cancelar</Button>
        <Button size="sm" onClick={() => onSave(form)} disabled={saving || !form.name.trim()} className="text-xs">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Guardar
        </Button>
      </div>
    </div>
  );
}

export function IconTab() {
  const { influencers, loading, saving, create, update, remove } = useInfluencers();
  const [editing, setEditing] = useState<Influencer | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleSave(data: CreateInfluencerInput) {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    setEditing(null);
    setShowForm(false);
  }

  async function loadDefaults() {
    for (const inf of DEFAULT_INFLUENCERS) {
      await create(inf);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-vous-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={loadDefaults} className="text-xs font-sans">
          <Star size={13} className="mr-1" />
          Cargar influencers
        </Button>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }} className="text-xs">
          <Plus size={13} /> Agregar
        </Button>
      </div>

      {showForm && (
        <InfluencerForm
          initial={editing ? { ...editing } : { ...EMPTY_FORM }}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setShowForm(false); }}
          saving={saving}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {influencers.map((inf) => (
          <div
            key={inf.id}
            className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden group"
          >
            <div className="aspect-[4/5] bg-vous-cream relative overflow-hidden">
              {inf.imageUrl ? (
                <img src={inf.imageUrl} alt={inf.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Star size={48} className="text-vous-gold/30" strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditing(inf); setShowForm(true); }}
                  className="bg-white/90 backdrop-blur text-vous-text p-2 rounded-xl text-[10px] font-nav hover:bg-vous-gold hover:text-white transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(inf.id)}
                  className="bg-white/90 backdrop-blur text-vous-accent-red p-2 rounded-xl text-[10px] font-nav hover:bg-vous-accent-red hover:text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-serif text-lg text-vous-text">{inf.name}</h3>
              <div className="flex flex-col gap-1">
                {inf.instagramUrl && (
                  <a
                    href={inf.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-vous-text-secondary hover:text-vous-gold text-[11px] font-sans transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    Instagram
                  </a>
                )}
                {inf.tiktokUrl && (
                  <a
                    href={inf.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-vous-text-secondary hover:text-vous-accent-purple text-[11px] font-sans transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.87 2.87 0 0 1 1.14.23V9.16a6.34 6.34 0 0 0-1.14-.11A6.21 6.21 0 0 0 4.17 15.3a6.21 6.21 0 0 0 6.22 6.05 6.22 6.22 0 0 0 6.22-6.05V9.02a8.29 8.29 0 0 0 4.83 1.54V7.11a4.86 4.86 0 0 1-1.85-.42z"/></svg>
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
