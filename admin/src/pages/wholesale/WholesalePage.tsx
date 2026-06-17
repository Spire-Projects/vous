import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { WholesaleRulesPanel } from "@/components/wholesale/WholesaleRulesPanel";
import { WholesaleTermsPanel } from "@/components/wholesale/WholesaleTermsPanel";
import { WholesaleRequestsTab } from "./WholesaleRequestsTab";
import { useWholesale } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";

export function WholesalePage() {
  const { user } = useAuth();
  const { requests, loading, error, review } = useWholesale();
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "rules" | "terms">("requests");

  async function handleReview(req: WholesaleRequest, status: "approved" | "rejected") {
    setReviewLoading(req.id);
    try {
      await review({
        requestId: req.id,
        status,
        reviewNote: reviewNote.trim() || undefined,
        reviewedBy: user?.email ?? user?.uid ?? "admin",
      });
    } finally {
      setReviewLoading(null);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Mayoristas"
        subtitle="Gestión de distribuidores VOUS — solicitudes, configuración comercial y términos de conducta."
      />

      <div className="flex gap-1 border-b border-white/40 pb-1">
        <button
          onClick={() => setActiveTab("requests")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "requests"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          Solicitudes
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "rules"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          Configuración Comercial
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "terms"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          Términos para Mayoristas
        </button>
      </div>

      {activeTab === "rules" && (
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6">
          <WholesaleRulesPanel />
        </div>
      )}
      {activeTab === "terms" && (
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6">
          <WholesaleTermsPanel />
        </div>
      )}
      {activeTab === "requests" && (
        <WholesaleRequestsTab
          requests={requests}
          loading={loading}
          error={error}
          reviewLoading={reviewLoading}
          reviewNote={reviewNote}
          onReviewNoteChange={setReviewNote}
          onReview={handleReview}
        />
      )}
    </div>
  );
}
