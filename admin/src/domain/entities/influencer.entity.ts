export interface Influencer {
  id: string;
  name: string;
  imageUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  order: number;
}

export type CreateInfluencerInput = Omit<Influencer, "id">;
export type UpdateInfluencerInput = Partial<CreateInfluencerInput>;
