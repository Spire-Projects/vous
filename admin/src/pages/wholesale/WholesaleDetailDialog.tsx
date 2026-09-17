import { useState } from "react";
import { Check, X, ExternalLink, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";
import { STATUS_VARIANT, STATUS_LABEL, HOW_FOUND_LABELS, formatDate } from "./types";

interface WholesaleDetailDialogProps {
  selected: WholesaleRequest | null;
  onClose: () => void;
  reviewLoading: string | null;
  reviewNote: string;
  onReviewNoteChange: (v: string) => void;
  onApprove: (req: WholesaleRequest) => void;
  onReject: (req: WholesaleRequest) => void;
}

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url) || url.includes("cloudinary");
}

export function WholesaleDetailDialog({
  selected,
  onClose,
  reviewLoading,
  reviewNote,
  onReviewNoteChange,
  onApprove,
  onReject,
}: WholesaleDetailDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!selected) return null;

  const files = selected.onlineStoreFiles ?? [];

  return (
    <>
      <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected.contactName}</DialogTitle>
            <DialogDescription>
              CI: {selected.carnetIdentidad ?? "—"} · {selected.phone}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                  Departamento
                </p>
                <p className="font-sans text-vous-text">{selected.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                  ¿Cómo nos conoció?
                </p>
                <p className="font-sans text-vous-text">
                  {HOW_FOUND_LABELS[selected.howFound ?? ""] ?? selected.howFound ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                  Estado
                </p>
                <Badge variant={STATUS_VARIANT[selected.status]}>
                  {STATUS_LABEL[selected.status]}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                  Fecha
                </p>
                <p className="font-sans text-vous-text">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                  Dirección de Distribución
                </p>
                <p className="font-sans text-vous-text leading-relaxed">
                  {selected.distributionAddress ?? "—"}
                </p>
              </div>
              {selected.reviewNote && (
                <div className="col-span-2">
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">
                    Nota de Revisión
                  </p>
                  <p className="font-sans text-vous-text-secondary text-sm italic">{selected.reviewNote}</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div>
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-2">
                  Capturas de Tienda Online
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {files.map((url, i) =>
                    isImageUrl(url) ? (
                      <button
                        key={i}
                        onClick={() => setPreviewUrl(url)}
                        className="relative group aspect-square border border-vous-border overflow-hidden bg-white/90 cursor-zoom-in"
                      >
                        <img
                          src={url}
                          alt={`Archivo ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 bg-vous-soft-black/0 group-hover:bg-vous-soft-black/40 transition-colors flex items-center justify-center">
                          <Maximize2
                            size={14}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </span>
                      </button>
                    ) : (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 text-[11px] font-nav text-vous-gold border border-vous-gold/40 p-2 hover:bg-vous-gold hover:text-white transition-colors col-span-3"
                      >
                        <ExternalLink size={11} />
                        Archivo {i + 1}
                      </a>
                    )
                  )}
                </div>
              </div>
            )}

            {selected.status === "pending" && (
              <div className="space-y-1.5 pt-1 border-t border-white/40">
                <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary">
                  Nota de revisión (opcional)
                </p>
                <textarea
                  rows={2}
                  placeholder="Ej: Aprobado, distribuye en Santa Cruz zona norte…"
                  value={reviewNote}
                  onChange={(e) => onReviewNoteChange(e.target.value)}
                  className="flex w-full border border-vous-border bg-vous-surface px-3 py-2 font-sans text-sm text-vous-text placeholder:text-vous-text-secondary outline-none focus:border-vous-gold transition-colors resize-none"
                />
              </div>
            )}

            {selected.status === "pending" && (
              <div className="flex gap-2 pt-1 border-t border-white/40">
                <Button
                  size="sm"
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                  disabled={reviewLoading === selected.id}
                  onClick={() => onApprove(selected)}
                >
                  {reviewLoading === selected.id ? (
                    <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={13} /> Aprobar
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  disabled={reviewLoading === selected.id}
                  onClick={() => onReject(selected)}
                >
                  <X size={13} /> Rechazar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-size image preview modal */}
      {previewUrl && (
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="max-w-2xl p-2">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
