import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { RouteComponentProps } from "wouter";

export default function LoadingPage(_props: RouteComponentProps) {
  const message = "Procesando su pago...";
  const contactInfo = {
    phone: "600 360 0077",
    hours: "Lun - Vie: 9:00 a 19:00"
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white flex-col">
      <Card className="max-w-[500px] w-full shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-8 flex flex-col items-center">
          <div className="mb-8">
            <LoadingSpinner size="large" />
          </div>
          <h2 className="text-primary text-xl font-medium text-center">
            {message}
          </h2>
        </div>
      </Card>
      
      {/* Contact information */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-gray-600 mt-4">
        <div className="flex flex-col items-center">
          <p className="font-medium mb-2">Contact Center</p>
          <p>{contactInfo.phone}</p>
          <p>{contactInfo.hours}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-medium mb-2">Atención presencial</p>
          <p>Lun - Vie: 9:00 a 17:00</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full mt-16 py-4 bg-gray-100">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}