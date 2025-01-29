"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import * as z from "zod";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  codigoHex: z
    .string()
    .min(1, "El código hexadecimal es requerido")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Código hexadecimal inválido"),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData?: {
    id: number;
    nombre: string;
    codigoHex: string;
  } | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      codigoHex: initialData?.codigoHex || "#",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    console.log("Datos enviados:", data);
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/colors/${initialData.id}`, data);
      } else {
        await axios.post("/api/colors", data);
      }
      router.refresh();
      router.push("/colors");
      toast({
        title: "¡Éxito!",
        description: `Color ${initialData ? "actualizado" : "creado"} correctamente.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Algo salió mal.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Color</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <div className="grid grid-cols-2 gap-8">
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Classic Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="codigoHex" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Hexadecimal</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <Input disabled={loading} placeholder="#0047AB" {...field} />
                        <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: field.value }} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="flex justify-end">
                <Button disabled={loading} type="submit">
                  {initialData ? "Guardar cambios" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorForm;
