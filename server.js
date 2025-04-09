import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Referencia al archivo CJS
const cjsPath = path.join(__dirname, 'server.cjs');

// Función para usar funciones de Mercado Pago desde ESM
export async function useMercadoPago() {
  try {
    // Cargamos las funciones CJS usando child_process
    const mp = await import('./server.cjs', { assert: { type: 'json' } }).catch(() => null);
    
    if (mp) {
      return {
        initMercadoPago: mp.default.initMercadoPago,
        createPaymentPreference: mp.default.createPaymentPreference,
        createFallbackPayment: mp.default.createFallbackPayment,
        success: true
      };
    }
    
    // Fallback a usar execSync
    return {
      initMercadoPago: () => false,
      createPaymentPreference: () => ({
        success: false,
        error: 'No se pudo cargar el módulo de Mercado Pago'
      }),
      createFallbackPayment: (options) => ({
        success: true,
        paymentLink: `${options.backUrlBase}/payment-bridge`,
        preferenceId: `TEST-PREF-${Date.now()}`,
        isFallback: true
      }),
      success: false
    };
  } catch (error) {
    console.error('Error al cargar Mercado Pago:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Función simple para generar enlaces de pago simulados
export function createFallbackPayment(options) {
  const { backUrlBase } = options;
  return {
    success: true,
    paymentLink: `${backUrlBase}/payment-bridge`,
    preferenceId: `TEST-PREF-${Date.now()}`,
    isFallback: true
  };
}