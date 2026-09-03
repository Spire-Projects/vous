/**
 * PaymentConfig entity — configuración de pagos.
 * Firestore: settings/payment
 */
export interface PaymentConfig {
  qrImageUrl: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  instructions: string;
  updatedAt: string;
}
