import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateRut, formatRut } from "@/lib/rutValidator";

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    toast({
      title: "Procesando pago",
      description: `RUT: ${data.rut}`,
    });
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
        >
          Ir a Pagar
        </Button>
      </form>
    </Form>
  );
}
