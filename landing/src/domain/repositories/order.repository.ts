import type { Order, CreateOrderInput } from "@/domain/entities/order.entity";

export interface OrderRepository {
  findByUser(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(input: CreateOrderInput): Promise<Order>;
  updatePaymentProof(orderId: string, proofUrl: string): Promise<void>;
  /** Real-time subscription. Returns an unsubscribe function. */
  subscribeToUserOrders(
    userId: string,
    onNext: (orders: Order[]) => void,
    onError: (err: Error) => void
  ): () => void;
}
