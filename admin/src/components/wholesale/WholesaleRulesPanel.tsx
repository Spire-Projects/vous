import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useWholesaleRules } from "@/hooks/useWholesaleRules";

export function WholesaleRulesPanel() {
  const { rules, loading, error, update } = useWholesaleRules();
  const [saving, setSaving] = useState(false);

  const [minAmount, setMinAmount] = useState(500);
  const [minUnits, setMinUnits] = useState(6);
  const [discountPct, setDiscountPct] = useState(25);
  const [allowSize, setAllowSize] = useState(false);
  const [restrictions, setRestrictions] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  useState(() => {
    if (rules) {
      setMinAmount(rules.minimumPurchaseAmount);
      setMinUnits(rules.minimumPurchaseUnits);
      setDiscountPct(rules.discountPercentage);
      setAllowSize(rules.allowSizeSelection);
      setRestrictions(rules.restrictions.join("\n"));
      setNotes(rules.notes ?? "");
      setIsActive(rules.isActive);
    }
  });

  async function handleSave() {
    setSaving(true);
    try {
      await update({
        minimumPurchaseAmount: minAmount,
        minimumPurchaseUnits: minUnits,
        discountPercentage: discountPct,
        allowSizeSelection: allowSize,
        restrictions: restrictions
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        notes: notes.trim() || undefined,
        isActive,
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="py-16 text-center"><p className="text-sm text-red-600 font-nav">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings size={16} className="text-vous-gold" />
        <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-text">Configuración Comercial Mayorista</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Monto mínimo de compra (Bs.)</Label>
            <Input
              type="number"
              min={0}
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Cantidad mínima de unidades</Label>
            <Input
              type="number"
              min={1}
              value={minUnits}
              onChange={(e) => setMinUnits(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Descuento base para mayoristas (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={allowSize} onCheckedChange={(c) => setAllowSize(Boolean(c))} id="wr-size" />
            <Label htmlFor="wr-size" className="cursor-pointer">Permitir selección de talla individual</Label>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={isActive} onCheckedChange={(c) => setIsActive(Boolean(c))} id="wr-active" />
            <Label htmlFor="wr-active" className="cursor-pointer">Reglas activas</Label>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Restricciones (una por línea)</Label>
            <Textarea
              rows={4}
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="Ej: No se puede seleccionar talla individual en pedidos mayoristas."
            />
          </div>
          <div>
            <Label>Notas adicionales</Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información interna sobre las reglas..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/40">
        <Button onClick={() => void handleSave()} disabled={saving}>
          <Save size={14} /> {saving ? "Guardando..." : "Guardar Reglas"}
        </Button>
      </div>
    </div>
  );
}
