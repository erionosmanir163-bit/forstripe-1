import express from 'express';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Shopify
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products'],
  hostName: process.env.SHOPIFY_STORE_URL,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false
});

// Endpoint para generar enlace de pago
app.post('/generar-enlace', async (req, res) => {
  try {
    console.log('Solicitud recibida para generar enlace de pago:', req.body);
    const { cuotas } = req.body;
    
    if (!cuotas || !Array.isArray(cuotas) || cuotas.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron cuotas válidas' });
    }
    
    console.log('Procesando cuotas:', cuotas);
    
    // Crear line items para Shopify basados en las cuotas seleccionadas
    const line_items = cuotas.map(cuota => ({
      variant_id: "123456789", // Usaremos este ID temporal, se reemplazará con el real
      quantity: 1,
      price: (cuota.total / 100).toFixed(2) // Convertir a formato decimal para Shopify
    }));
    
    console.log('Line items creados:', line_items);
    
    // Crear un Draft Order en Shopify
    const session = shopify.session.customAppSession(process.env.SHOPIFY_STORE_URL.replace('https://', ''));
    
    // Debido a que no podemos usar la API real en este momento, vamos a simular la respuesta
    // En un entorno de producción, esto sería reemplazado por el código real de Shopify
    
    console.log('Simulando creación de orden en Shopify con session:', session);
    
    // Simular DraftOrder para pruebas
    const draftOrderId = `gid://shopify/DraftOrder/${Date.now()}`;
    const draftOrder = {
      id: draftOrderId,
      status: "open",
      total_price: line_items.reduce((sum, item) => sum + parseFloat(item.price), 0).toString()
    };
    
    console.log('Draft Order simulado:', draftOrder);
    
    // Simular completado de orden con un enlace funcional
    // En lugar de intentar redirigir a Shopify directamente (lo que requiere una tienda configurada),
    // usaremos un enlace simulado a PaymentSuccessPage para pruebas
    const completedOrder = {
      id: draftOrderId,
      status: "completed",
      invoice_url: `${req.protocol}://${req.get('host')}/payment-success?order=${draftOrderId}&timestamp=${Date.now()}`
    };
    
    console.log('Order completado, enlace generado:', completedOrder.invoice_url);
    
    // Devolver el enlace de pago al cliente
    res.json({ paymentLink: completedOrder.invoice_url });
  } catch (error) {
    console.error('Error al generar enlace de pago:', error);
    res.status(500).json({ error: 'Error al generar el enlace de pago', details: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de integración Shopify ejecutándose en el puerto ${PORT}`);
});

// Exportar app para testing o integración con otros servicios
export default app;