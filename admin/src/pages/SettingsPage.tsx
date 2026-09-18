import { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import {
  BrandTab,
  ContactTab,
  SocialTab,
  PoliciesTab,
  ScheduleTab,
  PaymentTab,
  ContentSectionsTab,
  useSettingsForm,
  TABS,
} from "@/components/settings";
import type { TabId } from "@/components/settings";

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
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)]">
        <PageHeader
          category="Configuración"
          title="Configuración del Sistema"
          subtitle="Gestiona la identidad y opciones operativas del sistema."
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#C9A84C]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)] space-y-6">
      <PageHeader
        category="Configuración"
        title="Configuración del Sistema"
        subtitle="Gestiona la identidad y opciones operativas del sistema."
        action={
          <Button onClick={handleSave} disabled={saving} className="shrink-0 gap-2">
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={15} strokeWidth={2} />
            )}
            <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === id
                ? "bg-white text-slate-900 font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon size={15} strokeWidth={2} className="shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-y-auto p-5 sm:p-6">
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
            ubicacionUrl={form.ubicacionUrl}
            setUbicacionUrl={form.setUbicacionUrl}
            ubicacionActive={form.ubicacionActive}
            setUbicacionActive={form.setUbicacionActive}
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
        {activeTab === "content" && visited.has("content") && (
          <ContentSectionsTab
            fashionTrends={form.fashionTrends}
            setFashionTrends={form.setFashionTrends}
            vousNews={form.vousNews}
            setVousNews={form.setVousNews}
            newPosts={form.newPosts}
            setNewPosts={form.setNewPosts}
            feedback={form.feedback}
            setFeedback={form.setFeedback}
          />
        )}
        {activeTab === "schedule" && visited.has("schedule") && (
          <ScheduleTab
            extendedSchedules={form.extendedSchedules}
            setExtendedSchedules={form.setExtendedSchedules}
          />
        )}
        {activeTab === "payment" && visited.has("payment") && (
          <PaymentTab paymentConfig={paymentConfig} />
        )}
      </div>
    </div>
  );
}
