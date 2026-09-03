import type { Influencer, CreateInfluencerInput, UpdateInfluencerInput } from "@/domain/entities/influencer.entity";

export interface InfluencerRepository {
  getAll(): Promise<Influencer[]>;
  create(input: CreateInfluencerInput): Promise<Influencer>;
  update(id: string, input: UpdateInfluencerInput): Promise<void>;
  delete(id: string): Promise<void>;
}
