import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

/**
 * Esta función crea un Payment Intent usando Stripe
 */
export async function createPaymentIntent(paymentData: any) {
  console.log('💲 Creando Payment Intent con Stripe');
  
  try {
    const response = await apiRequest(
      'POST',
      '/api/create-payment-intent',
      {
        amount: paymentData.amount
      }
    );
    
    const data = await response.json();
    console.log('✅ Payment Intent creado:', data);
    
    return {
      success: true,
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      data: data
    };
  } catch (error) {
    console.error('❌ Error creando Payment Intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Hook para usar Stripe en componentes React
 */
export function useStripe() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      try {
        if (typeof window.Stripe === 'undefined') {
          throw new Error('El SDK de Stripe no se cargó correctamente');
        }
        
        console.log('✅ SDK de Stripe cargado correctamente');
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error cargando SDK de Stripe:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setIsLoading(false);
      }
    };
    
    script.onerror = () => {
      console.error('❌ Error cargando SDK de Stripe');
      setError('No se pudo cargar el SDK de Stripe');
      setIsLoading(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return { isLoading, error };
}

// Añadir la definición global para TypeScript
declare global {
  interface Window {
    Stripe: any;
  }
}