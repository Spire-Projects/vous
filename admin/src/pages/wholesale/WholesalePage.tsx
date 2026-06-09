import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { WholesaleRulesPanel } from "@/components/wholesale/WholesaleRulesPanel";
import { WholesaleRequestsTab } from "./WholesaleRequestsTab";
import { useWholesale } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";

export function WholesalePage() {
  const { user } = useAuth();
  const { requests, loading, error, review } = useWholesale();
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "rules">("requests");

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
        title="Solicitudes Mayoristas"
        subtitle="Gestión de distribuidores VOUS — formulario oficial de clientes por mayor."
      />

      <div className="flex gap-1 border-b border-white/40">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-3 font-nav text-[11px] uppercase tracking-wider transition-colors ${
            activeTab === "requests"
              ? "border-b-2 border-vous-gold text-vous-gold"
              : "text-vous-text-secondary hover:text-vous-text"
          }`}
        >
          Solicitudes
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-5 py-3 font-nav text-[11px] uppercase tracking-wider transition-colors ${
            activeTab === "rules"
              ? "border-b-2 border-vous-gold text-vous-gold"
              : "text-vous-text-secondary hover:text-vous-text"
          }`}
        >
          Reglas Comerciales
        </button>
      </div>

      {activeTab === "rules" ? (
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6">
          <WholesaleRulesPanel />
        </div>
      ) : (
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
