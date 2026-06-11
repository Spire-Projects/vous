import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Influencer } from "@/domain/entities/influencer.entity";

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const q = query(collection(getFirebaseDb(), "influencers"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: (data.name as string) ?? "",
          imageUrl: (data.imageUrl as string) ?? "",
          instagramUrl: (data.instagramUrl as string) ?? "",
          tiktokUrl: (data.tiktokUrl as string) ?? "",
          order: (data.order as number) ?? 0,
        } as Influencer;
      });
      setInfluencers(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { influencers, loading };
}
