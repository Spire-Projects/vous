import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, QrCode, Store, Phone, Share2, FileText, Clock, CreditCard } from "lucide-react";
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
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
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
  const [termsOfService, setTermsOfService] = useState("");
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
    setGoogleMapsUrl(config.googleMapsUrl);
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
    setTermsOfService(config.termsOfService);
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
      googleMapsUrl,
      instagram: { url: instagramUrl, active: instagramActive },
      tiktok: { url: tiktokUrl, active: tiktokActive },
      facebook: { url: facebookUrl, active: facebookActive },
      pinterest: { url: pinterestUrl, active: pinterestActive },
      shippingPolicy,
      returnPolicy,
      termsOfService,
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
    googleMapsUrl, setGoogleMapsUrl,
    instagramUrl, setInstagramUrl, instagramActive, setInstagramActive,
    tiktokUrl, setTiktokUrl, tiktokActive, setTiktokActive,
    facebookUrl, setFacebookUrl, facebookActive, setFacebookActive,
    pinterestUrl, setPinterestUrl, pinterestActive, setPinterestActive,
    shippingPolicy, setShippingPolicy,
    returnPolicy, setReturnPolicy,
    termsOfService, setTermsOfService,
    schedule, setSchedule,
    toInput,
  };
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

const TABS = [
  { id: "brand", label: "Identidad", icon: Store },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "social", label: "Redes", icon: Share2 },
  { id: "policies", label: "Políticas", icon: FileText },
  { id: "schedule", label: "Horarios", icon: Clock },
  { id: "payment", label: "Pagos", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPage() {
  const { config, loading, saving, update } = useSiteConfig();
  const paymentConfig = usePaymentConfig();
  const form = useSettingsForm(config);

  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const [visited, setVisited] = useState<Set<TabId>>(new Set(["brand"]));

  const switchTab = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    setVisited((prev) => new Set(prev).add(tabId));
  }, []);

  async function handleSave() {
    await update(form.toInput());
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader title="Configuración del Sistema" subtitle="Gestiona la identidad visual y operativa de VOUS." />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-vous-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Gestiona la identidad visual y operativa de VOUS."
        action={
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2} />}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        }
      />

      {/* Tabs nav */}
      <div className="flex flex-wrap gap-1 border-b border-[#E8E5E1] mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-sans border-b-2 transition-colors -mb-[1px] ${
              activeTab === id
                ? "border-vous-gold text-vous-gold font-semibold"
                : "border-transparent text-vous-gray hover:text-vous-soft-black"
            }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content — lazy */}
      <div className="bg-white border border-[#E8E5E1] p-6">
        {activeTab === "brand" && visited.has("brand") && (
          <BrandTab
            logoUrl={form.logoUrl}
            setLogoUrl={form.setLogoUrl}
            storeName={form.storeName}
            setStoreName={form.setStoreName}
            tagline={form.tagline}
            setTagline={form.setTagline}
          />
        )}
        {activeTab === "contact" && visited.has("contact") && (
          <ContactTab
            whatsappNumber={form.whatsappNumber}
            setWhatsappNumber={form.setWhatsappNumber}
            whatsappMessage={form.whatsappMessage}
            setWhatsappMessage={form.setWhatsappMessage}
            email={form.email}
            setEmail={form.setEmail}
            address={form.address}
            setAddress={form.setAddress}
            city={form.city}
            setCity={form.setCity}
            googleMapsUrl={form.googleMapsUrl}
            setGoogleMapsUrl={form.setGoogleMapsUrl}
          />
        )}
        {activeTab === "social" && visited.has("social") && (
          <SocialTab
            instagramUrl={form.instagramUrl}
            setInstagramUrl={form.setInstagramUrl}
            instagramActive={form.instagramActive}
            setInstagramActive={form.setInstagramActive}
            tiktokUrl={form.tiktokUrl}
            setTiktokUrl={form.setTiktokUrl}
            tiktokActive={form.tiktokActive}
            setTiktokActive={form.setTiktokActive}
            facebookUrl={form.facebookUrl}
            setFacebookUrl={form.setFacebookUrl}
            facebookActive={form.facebookActive}
            setFacebookActive={form.setFacebookActive}
            pinterestUrl={form.pinterestUrl}
            setPinterestUrl={form.setPinterestUrl}
            pinterestActive={form.pinterestActive}
            setPinterestActive={form.setPinterestActive}
          />
        )}
        {activeTab === "policies" && visited.has("policies") && (
          <PoliciesTab
            shippingPolicy={form.shippingPolicy}
            setShippingPolicy={form.setShippingPolicy}
            returnPolicy={form.returnPolicy}
            setReturnPolicy={form.setReturnPolicy}
            termsOfService={form.termsOfService}
            setTermsOfService={form.setTermsOfService}
          />
        )}
        {activeTab === "schedule" && visited.has("schedule") && (
          <ScheduleTab schedule={form.schedule} setSchedule={form.setSchedule} />
        )}
        {activeTab === "payment" && visited.has("payment") && (
          <PaymentTab paymentConfig={paymentConfig} />
        )}
      </div>
    </div>
  );
}

/* ── Tab content components ── */

function BrandTab({
  logoUrl, setLogoUrl,
  storeName, setStoreName,
  tagline, setTagline,
}: {
  logoUrl: string; setLogoUrl: (v: string) => void;
  storeName: string; setStoreName: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Identidad de Marca</h2>
      <div className="space-y-1">
        <Label>Logo del sitio</Label>
        <ImagePicker value={logoUrl} onChange={setLogoUrl} folder="vous/logos" label="Subir logo" aspect="logo" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nombre de la tienda</Label>
          <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Tagline</Label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Moda urbana contemporánea" />
        </div>
      </div>
    </div>
  );
}

function ContactTab({
  whatsappNumber, setWhatsappNumber,
  whatsappMessage, setWhatsappMessage,
  email, setEmail,
  address, setAddress,
  city, setCity,
  googleMapsUrl, setGoogleMapsUrl,
}: {
  whatsappNumber: string; setWhatsappNumber: (v: string) => void;
  whatsappMessage: string; setWhatsappMessage: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  googleMapsUrl: string; setGoogleMapsUrl: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Número de WhatsApp</Label>
          <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="59165359595" />
          <p className="text-[11px] text-vous-gray font-sans">Sin + ni espacios. Ej: 59165359595</p>
        </div>
        <div className="space-y-1">
          <Label>Email de contacto</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@vous.com.bo" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Mensaje pre-cargado de WhatsApp</Label>
        <Textarea
          value={whatsappMessage}
          onChange={(e) => setWhatsappMessage(e.target.value)}
          placeholder="Hola, quisiera información sobre..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Dirección</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="C. Esteban Arze 1355" />
        </div>
        <div className="space-y-1">
          <Label>Ciudad</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cochabamba" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Link de Google Maps</Label>
        <Input value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} placeholder="https://www.google.com/maps/place/..." />
        <p className="text-[11px] text-vous-gray font-sans">Link de Google Maps para mostrar en la página de Nosotros.</p>
      </div>
    </div>
  );
}

function SocialTab({
  instagramUrl, setInstagramUrl, instagramActive, setInstagramActive,
  tiktokUrl, setTiktokUrl, tiktokActive, setTiktokActive,
  facebookUrl, setFacebookUrl, facebookActive, setFacebookActive,
  pinterestUrl, setPinterestUrl, pinterestActive, setPinterestActive,
}: {
  instagramUrl: string; setInstagramUrl: (v: string) => void; instagramActive: boolean; setInstagramActive: (v: boolean) => void;
  tiktokUrl: string; setTiktokUrl: (v: string) => void; tiktokActive: boolean; setTiktokActive: (v: boolean) => void;
  facebookUrl: string; setFacebookUrl: (v: string) => void; facebookActive: boolean; setFacebookActive: (v: boolean) => void;
  pinterestUrl: string; setPinterestUrl: (v: string) => void; pinterestActive: boolean; setPinterestActive: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Redes Sociales</h2>
      <div className="space-y-4">
        <SocialRow label="Instagram" url={instagramUrl} setUrl={setInstagramUrl} active={instagramActive} setActive={setInstagramActive} />
        <SocialRow label="TikTok" url={tiktokUrl} setUrl={setTiktokUrl} active={tiktokActive} setActive={setTiktokActive} />
        <SocialRow label="Facebook" url={facebookUrl} setUrl={setFacebookUrl} active={facebookActive} setActive={setFacebookActive} />
        <SocialRow label="Pinterest" url={pinterestUrl} setUrl={setPinterestUrl} active={pinterestActive} setActive={setPinterestActive} />
      </div>
    </div>
  );
}

function PoliciesTab({
  shippingPolicy, setShippingPolicy,
  returnPolicy, setReturnPolicy,
  termsOfService, setTermsOfService,
}: {
  shippingPolicy: string; setShippingPolicy: (v: string) => void;
  returnPolicy: string; setReturnPolicy: (v: string) => void;
  termsOfService: string; setTermsOfService: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Políticas</h2>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Política de Envíos</Label>
          <RichTextEditor content={shippingPolicy} onChange={setShippingPolicy} />
        </div>
        <div className="space-y-1">
          <Label>Política de Devoluciones</Label>
          <RichTextEditor content={returnPolicy} onChange={setReturnPolicy} />
        </div>
        <div className="space-y-1">
          <Label>Términos y Condiciones</Label>
          <RichTextEditor content={termsOfService} onChange={setTermsOfService} />
        </div>
      </div>
    </div>
  );
}

function ScheduleTab({
  schedule, setSchedule,
}: {
  schedule: ScheduleItem[]; setSchedule: (v: ScheduleItem[]) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Horarios de Atención</h2>
      <div className="space-y-3">
        {schedule.map((item, idx) => (
          <div key={item.day} className="grid grid-cols-[120px_1fr] gap-3 items-center">
            <span className="font-nav text-[12px] uppercase tracking-wide text-vous-black">{item.day}</span>
            <Input
              value={item.hours}
              onChange={(e) => {
                const next = [...schedule];
                next[idx] = { ...item, hours: e.target.value };
                setSchedule(next);
              }}
              placeholder="Cerrado"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentTab({ paymentConfig }: { paymentConfig: ReturnType<typeof usePaymentConfig> }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-soft-black">Configuración de Pagos</h2>
      <p className="font-sans text-sm text-vous-gray">
        Configura el QR y los datos bancarios que los clientes verán al realizar un pedido.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Nombre del Banco</Label>
          <Input
            value={paymentConfig.config?.bankName ?? ""}
            onChange={(e) => paymentConfig.update({ bankName: e.target.value })}
            placeholder="Banco Mercantil Santa Cruz"
          />
        </div>
        <div className="space-y-1">
          <Label>Titular de la cuenta</Label>
          <Input
            value={paymentConfig.config?.accountHolder ?? ""}
            onChange={(e) => paymentConfig.update({ accountHolder: e.target.value })}
            placeholder="VOUS S.R.L."
          />
        </div>
        <div className="space-y-1">
          <Label>Número de cuenta</Label>
          <Input
            value={paymentConfig.config?.accountNumber ?? ""}
            onChange={(e) => paymentConfig.update({ accountNumber: e.target.value })}
            placeholder="1234567890"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Instrucciones de pago</Label>
        <Textarea
          value={paymentConfig.config?.instructions ?? ""}
          onChange={(e) => paymentConfig.update({ instructions: e.target.value })}
          placeholder="Realizar la transferencia por el monto exacto y subir el comprobante. El pedido se confirma al verificar el pago."
          rows={3}
        />
      </div>
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
            <span className="font-nav text-[10px] uppercase tracking-wide text-vous-gray">QR actual</span>
            <img src={paymentConfig.config.qrImageUrl} alt="QR de pago activo" className="w-36 h-36 object-contain border border-vous-border" />
          </div>
        )}
      </div>
      {paymentConfig.saving && (
        <div className="flex items-center gap-2 text-vous-gray font-sans text-xs">
          <Loader2 size={12} className="animate-spin" /> Guardando configuración de pagos…
        </div>
      )}
    </div>
  );
}
