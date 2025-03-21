import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateRut, formatRut } from "@/lib/rutValidator";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Schema for RUT validation
const formSchema = z.object({
  rut: z.string()
    .min(1, "Por favor ingresa tu RUT")
    .refine(validateRut, {
      message: "Por favor ingresa un RUT válido"
    })
});

type FormValues = z.infer<typeof formSchema>;

export default function RutInput() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call/processing for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to loading page
      navigate("/loading");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRut(e.target.value);
    form.setValue("rut", formattedValue, { shouldValidate: false });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="rut"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="text-gray-700">Rut</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa tu RUT"
                  {...field}
                  onChange={(e) => {
                    handleRutChange(e);
                    field.onChange(e);
                  }}
                  disabled={isSubmitting}
                  className="px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 transition-colors"
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
  );
}
