/**
 * PaymentConfig entity — configuración de métodos de pago de VOUS.
 * Almacenado en Firestore: settings/payment
 */
export interface PaymentConfig {
  qrImageUrl: string;
  updatedAt: string;
}

export interface UpdatePaymentConfigInput {
  qrImageUrl?: string;
}
