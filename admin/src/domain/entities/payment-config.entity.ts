/**
 * PaymentConfig entity — configuración de métodos de pago de VOUS.
 * Almacenado en Firestore: settings/payment
 */
export interface PaymentConfig {
  qrImageUrl: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  instructions: string;
  updatedAt: string;
}

export interface UpdatePaymentConfigInput {
  qrImageUrl?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  instructions?: string;
}
