/**
 * Implementación directa para Mercado Pago sin usar el SDK
 * Evitamos problemas de compatibilidad entre ESM y CommonJS
 */

// Configuración de la integración con Mercado Pago
function getConfig() {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("🚫 ERROR: No se encontró el token de acceso de Mercado Pago");
    return null;
  }
  
  return {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    apiBase: 'https://api.mercadopago.com'
  };
}

/**
 * Crea una preferencia de pago llamando directamente a la API de Mercado Pago
 * @param {Object} options Opciones para crear la preferencia
 * @returns {Promise<Object>} Resultado de la creación de la preferencia
 */
async function createPreference(options) {
  try {
    const config = getConfig();
    if (!config) {
      throw new Error('No se pudo obtener la configuración de Mercado Pago');
    }
    
    const { items, backUrls, autoReturn, externalReference, statement_descriptor } = options;
    
    console.log('🔄 Creando preferencia en Mercado Pago (Método directo)');
    
    // Construimos la URL de la API
    const apiUrl = `${config.apiBase}/checkout/preferences`;
    
    // Creamos el payload
    const payload = {
      items,
      back_urls: backUrls,
      auto_return: autoReturn || 'approved',
      statement_descriptor: statement_descriptor || 'Forum Pagos',
      external_reference: externalReference || `FORUM-${Date.now()}`,
      // Configuración específica para Chile
      payment_methods: {
        excluded_payment_types: [
          { id: "atm" },
          { id: "ticket" }
        ],
        installments: 1
      }
    };
    
    console.log('📤 Enviando payload a Mercado Pago:', JSON.stringify(payload, null, 2));
    
    // Hacemos la petición a la API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Manejamos la respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error en la respuesta de Mercado Pago:', response.status, errorData);
      throw new Error(`Error en la API de Mercado Pago: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    // Procesamos la respuesta exitosa
    const data = await response.json();
    console.log('✅ Preferencia creada correctamente:', data.id);
    
    return {
      success: true,
      preferenceId: data.id,
      paymentLink: data.init_point
    };
  } catch (error) {
    console.error('❌ Error al crear preferencia de pago:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Función de fallback para crear un enlace de pago simulado
 * @param {Object} options Opciones para crear el enlace
 * @returns {Object} Enlace y preferencia simulados
 */
function createFallbackPayment(options) {
  const { backUrlBase } = options;
  return {
    success: true,
    paymentLink: `${backUrlBase}/payment-bridge`,
    preferenceId: `TEST-PREF-${Date.now()}`,
    isFallback: true
  };
}

// Exportamos las funciones
module.exports = {
  createPreference,
  createFallbackPayment
};