import type { WholesaleRepository } from "@/domain/repositories/wholesale.repository";
import type { WholesaleRequest, ReviewWholesaleInput } from "@/domain/entities/wholesale.entity";

export async function getWholesaleRequests(repo: WholesaleRepository): Promise<WholesaleRequest[]> {
  return repo.findAll();
}

export async function reviewWholesaleRequest(
  repo: WholesaleRepository,
  input: ReviewWholesaleInput
): Promise<void> {
  return repo.review(input);
}
