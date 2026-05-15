import type { WholesaleRepository } from "@/domain/repositories/wholesale.repository";
import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";

type WholesaleInput = Omit<WholesaleRequest, "id" | "status" | "createdAt">;

export async function submitWholesaleRequest(
  repo: WholesaleRepository,
  input: WholesaleInput
): Promise<void> {
  if (!input.nombre || !input.email || !input.empresa || !input.telefono || !input.departamento) {
    throw new Error("Nombre, email, empresa, teléfono y departamento son requeridos");
  }
  return repo.submit(input);
}
