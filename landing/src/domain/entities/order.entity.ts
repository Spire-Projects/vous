export type OrderStatus = "pending" | "sent" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}
