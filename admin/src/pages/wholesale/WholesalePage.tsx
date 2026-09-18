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
  const [activeTab, setActiveTab] = useState<"requests" | "rules" | "terms">(
    "requests",
  );

  async function handleReview(
    req: WholesaleRequest,
    status: "approved" | "rejected",
  ) {
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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)] space-y-6">
      <PageHeader
        category="Personas"
        title="Mayoristas"
        subtitle="Gestión de distribuidores — solicitudes, configuración comercial y términos de conducta."
      />

      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "requests"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Solicitudes
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "rules"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Configuración Comercial
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "terms"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Términos para Mayoristas
        </button>
      </div>

      {activeTab === "rules" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden p-6">
          <WholesaleRulesPanel />
        </div>
      )}
      {activeTab === "terms" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden p-6">
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
