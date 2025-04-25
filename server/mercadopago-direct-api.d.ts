/**
 * Declaración de tipos para la implementación de Mercado Pago directo
 */

export interface MercadoPagoPreferenceOptions {
  items: any[];
  backUrlBase: string;
  backUrls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  description?: string;
}

export interface MercadoPagoPreferenceResult {
  success: boolean;
  preferenceId?: string;
  paymentLink?: string;
  error?: string;
}

export interface FallbackPaymentOptions {
  backUrlBase: string;
}

export interface FallbackPaymentResult {
  success: boolean;
  paymentLink: string;
  preferenceId: string;
}

/**
 * Crea una preferencia de pago llamando directamente a la API de Mercado Pago
 */
export function createMercadoPagoPreference(options: MercadoPagoPreferenceOptions): Promise<MercadoPagoPreferenceResult>;

/**
 * Función de fallback para crear un enlace de pago simulado
 */
export function createFallbackPayment(options: FallbackPaymentOptions): FallbackPaymentResult;