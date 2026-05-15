// ── Infrastructure layer — barrel export ──────────────────────────────────
export { firestoreProductRepository } from "./repositories/firestore-product.repository";
export { firestoreOrderRepository } from "./repositories/firestore-order.repository";
export {
  firestoreCustomerRepository,
  firestoreAdminUserRepository,
} from "./repositories/firestore-user.repository";
export { firestoreWholesaleRepository } from "./repositories/firestore-wholesale.repository";
