import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, title, description = "Esta acción no se puede deshacer.", onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-vous-black/50 z-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6 max-w-sm w-full mx-4">
        <p className="font-nav text-[13px] uppercase tracking-wide text-vous-text mb-2">{title}</p>
        <p className="font-sans text-sm text-vous-text-secondary mb-6">{description}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}
