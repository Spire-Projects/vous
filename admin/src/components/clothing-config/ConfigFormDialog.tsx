import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export interface ConfigFormField {
  key: string;
  label: string;
  type: "text" | "color";
  required?: boolean;
}

export interface ConfigFormDialogProps<T> {
  open: boolean;
  title: string;
  editing: T | null;
  fields: ConfigFormField[];
  onClose: () => void;
  onSave: (data: Record<string, string | boolean | number>) => void;
}

export function ConfigFormDialog<T extends Record<string, unknown>>({
  open,
  title,
  editing,
  fields,
  onClose,
  onSave,
}: ConfigFormDialogProps<T>) {
  const [saving, setSaving] = useState(false);

  const initialForm = useMemo(() => {
    const initial: Record<string, string | boolean | number> = {};
    for (const f of fields) {
      if (editing && editing[f.key] !== undefined) {
        initial[f.key] = editing[f.key] as string | boolean | number;
      } else {
        initial[f.key] = f.type === "color" ? "#000000" : "";
      }
    }
    initial["isActive"] = editing ? (editing.isActive as boolean) ?? true : true;
    return initial;
  }, [editing, fields]);

  const [form, setForm] = useState<Record<string, string | boolean | number>>(initialForm);

  // Reset form when open/editing changes via key on DialogContent
  const dialogKey = open ? (editing ? String(editing.id) : "new") : "closed";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent key={dialogKey} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? `Editar ${title}` : `Nueva ${title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key} className="font-nav text-[11px] uppercase tracking-wider">
                {field.label}
              </Label>
              {field.type === "text" && (
                <Input
                  id={field.key}
                  value={String(form[field.key] ?? "")}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  required={field.required}
                  className="font-sans"
                />
              )}
              {field.type === "color" && (
                <div className="flex items-center gap-3">
                  <input
                    id={field.key}
                    type="color"
                    value={String(form[field.key] ?? "#000000")}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-vous-border cursor-pointer"
                  />
                  <span className="text-xs font-mono text-vous-text-secondary">
                    {String(form[field.key] ?? "#000000")}
                  </span>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="isActive"
              checked={!!form["isActive"]}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked === true }))}
            />
            <Label htmlFor="isActive" className="font-nav text-[11px] uppercase tracking-wider cursor-pointer">
              Activo
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
