import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MercadoPagoForm() {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [, setLocation] = useLocation();
  
  // Recuperamos los datos guardados en sessionStorage
  const clientName = sessionStorage.getItem('clientName') || 'Cliente';
  const clientRut = sessionStorage.getItem('rutValue') || '';
  const selectedQuotasJSON = sessionStorage.getItem('selectedQuotas') || '[]';
  const selectedQuotas = JSON.parse(selectedQuotasJSON);
  
  // Calculamos el total a pagar
  const calculateTotal = () => {
    if (!selectedQuotas || !Array.isArray(selectedQuotas) || selectedQuotas.length === 0) return "$0";
    
    let total = 0;
    selectedQuotas.forEach((quota: any) => {
      const amount = quota.totalAmount;
      if (amount) {
        // Extraer solo números del monto
        const cleanAmount = amount.replace(/[^0-9]/g, '');
        total += parseInt(cleanAmount, 10);
      }
    });
    
    // Formatear el total en formato chileno
    return `$${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulamos un proceso de pago
    setTimeout(() => {
      // Redireccionamos a la página de éxito
      setLocation('/payment-success?status=approved&payment_id=MP-SIM-' + Date.now());
    }, 2000);
  };
  
  const formatCardNumber = (value: string) => {
    // Eliminar caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    // Limitar a 16 dígitos y formatear en grupos de 4
    const formattedValue = numbers.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue;
  };
  
  const formatExpiry = (value: string) => {
    // Eliminar caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    // Limitar a 4 dígitos (MM/YY)
    const month = numbers.slice(0, 2);
    const year = numbers.slice(2, 4);
    
    if (numbers.length > 2) {
      return `${month}/${year}`;
    }
    return month;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center">
              <img 
                src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/logo-mercadopago.png" 
                alt="Mercado Pago Logo" 
                className="h-8 mr-4"
              />
              <h1 className="text-2xl font-medium text-gray-800">Finaliza tu pago</h1>
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">Procesando tu pago...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-3/5">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Elige cómo pagar</h2>
                
                <div className="mb-6">
                  <div 
                    className={`border rounded p-4 mb-2 flex items-center cursor-pointer ${selectedMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedMethod('credit_card')}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3">
                      {selectedMethod === 'credit_card' && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Tarjeta de crédito</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <img src="https://www.mercadopago.com/org-img/MP3/API/logos/visa.gif" className="h-6" alt="Visa" />
                      <img src="https://www.mercadopago.com/org-img/MP3/API/logos/master.gif" className="h-6" alt="Mastercard" />
                      <img src="https://www.mercadopago.com/org-img/MP3/API/logos/amex.gif" className="h-6" alt="Amex" />
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded p-4 mb-2 flex items-center cursor-pointer ${selectedMethod === 'debit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedMethod('debit_card')}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3">
                      {selectedMethod === 'debit_card' && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Tarjeta de débito</p>
                      <p className="text-sm text-gray-500">Débito y Prepago</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded p-4 flex items-center cursor-pointer ${selectedMethod === 'webpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedMethod('webpay')}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3">
                      {selectedMethod === 'webpay' && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">WebPay</p>
                      <p className="text-sm text-gray-500">Pago seguro con Transbank</p>
                    </div>
                    <div className="ml-auto">
                      <img src="https://www.webpay.cl/images/logo.png" className="h-6" alt="WebPay" />
                    </div>
                  </div>
                </div>
                
                {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del titular</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Como aparece en la tarjeta"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento (MM/AA)</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código de seguridad</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="CVC"
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          required
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Pagar {calculateTotal()}
                    </button>
                  </form>
                )}
                
                {selectedMethod === 'webpay' && (
                  <div className="mt-6">
                    <button 
                      onClick={handlePayment}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Continuar a WebPay
                    </button>
                    <p className="mt-4 text-sm text-gray-500 text-center">
                      Serás redirigido al sitio seguro de Transbank para completar tu pago
                    </p>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/5 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Resumen de compra</h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{clientName}</p>
                  <p className="text-sm text-gray-700">{clientRut}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Detalle</p>
                  
                  {/* Mostramos las cuotas seleccionadas */}
                  {selectedQuotas && Array.isArray(selectedQuotas) && selectedQuotas.map((quota: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm mb-2">
                      <div>
                        <span className="font-medium">Cuota N°{quota.quotaNumber}</span>
                        <p className="text-xs text-gray-500">Contrato {quota.contractNumber}</p>
                      </div>
                      <span>{quota.totalAmount}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">{calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-3 rounded text-sm text-blue-700">
                  <p>
                    <span className="font-medium">Procesado por Mercado Pago</span> 
                    <br />Todos los pagos son procesados de forma segura
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}