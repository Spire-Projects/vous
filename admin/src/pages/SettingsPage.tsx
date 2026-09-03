import { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import {
  BrandTab, ContactTab, SocialTab, PoliciesTab, ScheduleTab, PaymentTab,
  ContentSectionsTab, useSettingsForm, TABS,
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <PageHeader title="Configuración del Sistema" subtitle="Gestiona la identidad visual y operativa de VOUS." />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-vous-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Gestiona la identidad visual y operativa de VOUS."
        action={
          <Button onClick={handleSave} disabled={saving} className="shrink-0">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2} />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        }
      />

      <div className="flex flex-nowrap overflow-x-auto gap-0.5 border-b border-white/40 mb-6 pb-1 -mx-1 px-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] shrink-0 whitespace-nowrap rounded-t-lg ${
              activeTab === id
                ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
                : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
            }`}
          >
            <Icon size={14} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-y-auto p-4 sm:p-6">
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
