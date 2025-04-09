// Importamos la biblioteca de MercadoPago
const mercadopago = require('mercadopago');

// Datos de la aplicación (puedes usar estos como valores predeterminados)
const MP_USER_ID = '327992698'; 
const MP_APP_ID = '5277893847107576';

// Función para inicializar MercadoPago
function initMercadoPago() {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.error('⚠️ No se encontró ACCESS_TOKEN para Mercado Pago');
    return false;
  }

  try {
    // Configuramos el SDK con el token de acceso
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
    });
    
    console.log('✅ Mercado Pago inicializado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar Mercado Pago:', error);
    return false;
  }
}

// Función para crear una preferencia de pago
async function createPaymentPreference(options) {
  try {
    const { amount, backUrlBase, description = 'Pago de Cuotas' } = options;
    
    // Verificamos que los parámetros sean válidos
    if (!amount || isNaN(amount)) {
      throw new Error('Monto inválido para la preferencia de pago');
    }
    
    // Creamos el objeto de preferencia
    const preference = {
      items: [
        {
          id: `pago-${Date.now()}`,
          title: description,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: parseFloat(amount)
        }
      ],
      back_urls: {
        success: `${backUrlBase}/payment-success`,
        failure: `${backUrlBase}/payment-failure`,
        pending: `${backUrlBase}/payment-pending`
      },
      auto_return: 'approved',
      // Información opcional del vendedor
      marketplace: 'Salvum Pagos',
      marketplace_fee: 0,
      external_reference: `ref-${Date.now()}`
    };
    
    // Enviamos la preferencia a Mercado Pago
    const response = await mercadopago.preferences.create(preference);
    
    // Devolvemos la respuesta
    return {
      success: true,
      paymentLink: response.body.init_point,
      preferenceId: response.body.id,
      response: response.body
    };
  } catch (error) {
    console.error('❌ Error al crear preferencia de pago:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al crear preferencia de pago'
    };
  }
}

// Función para crear un pago de fallback (para desarrollo)
function createFallbackPayment(options) {
  const { backUrlBase } = options;
  
  return {
    success: true,
    paymentLink: `${backUrlBase}/payment-bridge`,
    preferenceId: `TEST-PREF-${Date.now()}`,
    isFallback: true
  };
}

// Exportamos las funciones públicas
module.exports = {
  initMercadoPago,
  createPaymentPreference,
  createFallbackPayment
};