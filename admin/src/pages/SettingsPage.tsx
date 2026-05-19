import { useState, useEffect } from "react";
import { Save, Eye, Loader2, QrCode } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import type { SiteConfig, UpdateSiteConfigInput, ScheduleItem } from "@/domain/entities/site-config.entity";

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: "Lunes", hours: "" },
  { day: "Martes", hours: "" },
  { day: "Miércoles", hours: "" },
  { day: "Jueves", hours: "" },
  { day: "Viernes", hours: "" },
  { day: "Sábado", hours: "" },
  { day: "Domingo", hours: "" },
];

function useSettingsForm(config: SiteConfig | null) {
  const [logoUrl, setLogoUrl] = useState("");
  const [storeName, setStoreName] = useState("VOUS");
  const [tagline, setTagline] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [instagramActive, setInstagramActive] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [tiktokActive, setTiktokActive] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [facebookActive, setFacebookActive] = useState(false);
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [pinterestActive, setPinterestActive] = useState(false);
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!config) return;
    setLogoUrl(config.logoUrl);
    setStoreName(config.storeName);
    setTagline(config.tagline);
    setWhatsappNumber(config.whatsappNumber);
    setWhatsappMessage(config.whatsappMessage);
    setEmail(config.email);
    setAddress(config.address);
    setCity(config.city);
    setInstagramUrl(config.instagram?.url ?? "");
    setInstagramActive(config.instagram?.active ?? false);
    setTiktokUrl(config.tiktok?.url ?? "");
    setTiktokActive(config.tiktok?.active ?? false);
    setFacebookUrl(config.facebook?.url ?? "");
    setFacebookActive(config.facebook?.active ?? false);
    setPinterestUrl(config.pinterest?.url ?? "");
    setPinterestActive(config.pinterest?.active ?? false);
    setShippingPolicy(config.shippingPolicy);
    setReturnPolicy(config.returnPolicy);
    setSchedule(config.schedule?.length ? config.schedule : DEFAULT_SCHEDULE);
  }, [config]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toInput(): UpdateSiteConfigInput {
    return {
      logoUrl,
      storeName,
      tagline,
      whatsappNumber,
      whatsappMessage,
      email,
      address,
      city,
      instagram: { url: instagramUrl, active: instagramActive },
      tiktok: { url: tiktokUrl, active: tiktokActive },
      facebook: { url: facebookUrl, active: facebookActive },
      pinterest: { url: pinterestUrl, active: pinterestActive },
      shippingPolicy,
      returnPolicy,
      schedule: schedule.filter((s) => s.hours.trim() !== ""),
    };
  }

  return {
    logoUrl, setLogoUrl,
    storeName, setStoreName,
    tagline, setTagline,
    whatsappNumber, setWhatsappNumber,
    whatsappMessage, setWhatsappMessage,
    email, setEmail,
    address, setAddress,
    city, setCity,
    instagramUrl, setInstagramUrl, instagramActive, setInstagramActive,
    tiktokUrl, setTiktokUrl, tiktokActive, setTiktokActive,
    facebookUrl, setFacebookUrl, facebookActive, setFacebookActive,
    pinterestUrl, setPinterestUrl, pinterestActive, setPinterestActive,
    shippingPolicy, setShippingPolicy,
    returnPolicy, setReturnPolicy,
    schedule, setSchedule,
    toInput,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-[#E8E5E1] p-6">
      <h2 className="font-serif text-xl text-vous-soft-black mb-5">{title}</h2>
      {children}
    </section>
  );
}

function SocialRow({
  label,
  url,
  setUrl,
  active,
  setActive,
}: {
  label: string;
  url: string;
  setUrl: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <Label>{label}</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={`https://${label.toLowerCase()}.com/...`} />
      </div>
      <div className="flex items-center gap-2 pt-5 shrink-0">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="accent-vous-gold w-4 h-4"
        />
        <span className="font-nav text-[12px] uppercase tracking-wide text-vous-black">Activo</span>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { config, loading, saving, update } = useSiteConfig();
  const paymentConfig = usePaymentConfig();
  const form = useSettingsForm(config);

  async function handleSave() {
    await update(form.toInput());
  }

  if (loading) {
    return (
      <div className="p-8">
        <PageHeader title="Configuración del Sistema" subtitle="Gestiona la identidad visual y operativa de VOUS." />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-vous-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Gestiona la identidad visual y operativa de VOUS."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open("/", "_blank")}>
              <Eye size={14} strokeWidth={2} /> Vista Previa
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2} />}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        }
      />

      <div className="space-y-8 max-w-4xl">
        {/* Identidad de Marca */}
        <Section title="Identidad de Marca">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Logo del sitio</Label>
              <ImagePicker value={form.logoUrl} onChange={form.setLogoUrl} folder="vous/logos" label="Subir logo" aspect="logo" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nombre de la tienda</Label>
                <Input value={form.storeName} onChange={(e) => form.setStoreName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={(e) => form.setTagline(e.target.value)} placeholder="Moda urbana contemporánea" />
              </div>
            </div>
          </div>
        </Section>

        {/* Contacto */}
        <Section title="Contacto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Número de WhatsApp</Label>
                <Input value={form.whatsappNumber} onChange={(e) => form.setWhatsappNumber(e.target.value)} placeholder="59165359595" />
                <p className="text-[11px] text-vous-gray font-sans">Sin + ni espacios. Ej: 59165359595</p>
              </div>
              <div className="space-y-1">
                <Label>Email de contacto</Label>
                <Input value={form.email} onChange={(e) => form.setEmail(e.target.value)} placeholder="hola@vous.com.bo" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Mensaje pre-cargado de WhatsApp</Label>
              <Textarea
                value={form.whatsappMessage}
                onChange={(e) => form.setWhatsappMessage(e.target.value)}
                placeholder="Hola, quisiera información sobre..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Dirección</Label>
                <Input value={form.address} onChange={(e) => form.setAddress(e.target.value)} placeholder="C. Esteban Arze 1355" />
              </div>
              <div className="space-y-1">
                <Label>Ciudad</Label>
                <Input value={form.city} onChange={(e) => form.setCity(e.target.value)} placeholder="Cochabamba" />
              </div>
            </div>
          </div>
        </Section>

        {/* Redes Sociales */}
        <Section title="Redes Sociales">
          <div className="space-y-4">
            <SocialRow label="Instagram" url={form.instagramUrl} setUrl={form.setInstagramUrl} active={form.instagramActive} setActive={form.setInstagramActive} />
            <SocialRow label="TikTok" url={form.tiktokUrl} setUrl={form.setTiktokUrl} active={form.tiktokActive} setActive={form.setTiktokActive} />
            <SocialRow label="Facebook" url={form.facebookUrl} setUrl={form.setFacebookUrl} active={form.facebookActive} setActive={form.setFacebookActive} />
            <SocialRow label="Pinterest" url={form.pinterestUrl} setUrl={form.setPinterestUrl} active={form.pinterestActive} setActive={form.setPinterestActive} />
          </div>
        </Section>

        {/* Políticas */}
        <Section title="Políticas">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Política de Envíos</Label>
              <RichTextEditor content={form.shippingPolicy} onChange={form.setShippingPolicy} />
            </div>
            <div className="space-y-1">
              <Label>Política de Devoluciones</Label>
              <RichTextEditor content={form.returnPolicy} onChange={form.setReturnPolicy} />
            </div>
          </div>
        </Section>

        {/* Horarios */}
        <Section title="Horarios de Atención">
          <div className="space-y-3">
            {form.schedule.map((item, idx) => (
              <div key={item.day} className="grid grid-cols-[120px_1fr] gap-3 items-center">
                <span className="font-nav text-[12px] uppercase tracking-wide text-vous-black">{item.day}</span>
                <Input
                  value={item.hours}
                  onChange={(e) => {
                    const next = [...form.schedule];
                    next[idx] = { ...item, hours: e.target.value };
                    form.setSchedule(next);
                  }}
                  placeholder="Cerrado"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* QR de Pago */}
        <Section title="Configuración de Pagos">
          <div className="space-y-4">
            <p className="font-sans text-sm text-vous-gray">
              Imagen del código QR que los clientes escanearán para realizar el pago por
              transferencia bancaria. Se muestra en el checkout de la tienda.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="space-y-1 w-full sm:w-80">
                <Label className="flex items-center gap-1.5">
                  <QrCode size={13} /> Imagen del QR activo
                </Label>
                <ImagePicker
                  value={paymentConfig.config?.qrImageUrl ?? ""}
                  onChange={async (url) => {
                    await paymentConfig.update({ qrImageUrl: url });
                  }}
                  folder="vous/qr"
                  label="Subir QR"
                  aspect="square"
                />
              </div>
              {paymentConfig.config?.qrImageUrl && (
                <div className="flex flex-col gap-2">
                  <span className="font-nav text-[10px] uppercase tracking-wide text-vous-gray">
                    QR actual
                  </span>
                  <img
                    src={paymentConfig.config.qrImageUrl}
                    alt="QR de pago activo"
                    className="w-36 h-36 object-contain border border-vous-border"
                  />
                </div>
              )}
            </div>
            {paymentConfig.saving && (
              <div className="flex items-center gap-2 text-vous-gray font-sans text-xs">
                <Loader2 size={12} className="animate-spin" /> Guardando QR…
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
