import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/blog/RichTextEditor";

interface PoliciesTabProps {
  shippingPolicy: string; setShippingPolicy: (v: string) => void;
  returnPolicy: string; setReturnPolicy: (v: string) => void;
  termsOfService: string; setTermsOfService: (v: string) => void;
}

export function PoliciesTab({
  shippingPolicy, setShippingPolicy,
  returnPolicy, setReturnPolicy,
  termsOfService, setTermsOfService,
}: PoliciesTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Políticas</h2>
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
