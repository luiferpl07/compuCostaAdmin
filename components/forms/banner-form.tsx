"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  isActive: z.boolean().default(true),
});

type BannerFormValues = z.infer<typeof formSchema>;

interface BannerFormProps {
  initialData?: BannerFormValues & {
    id: number;
  };
}

export default function BannerForm({ initialData }: BannerFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      isActive: true,
    },
  });

  // Sincronizar manualmente los valores del formulario cuando cambie `initialData`
  useEffect(() => {
    if (initialData) {
      form.setValue("title", initialData.title);
      form.setValue("imageUrl", initialData.imageUrl);
      form.setValue("isActive", initialData.isActive);
    }
  }, [initialData, form]);

  const onSubmit = async (data: BannerFormValues) => {
    try {
      setLoading(true);

      const url = initialData 
        ? `/api/banners/${initialData.id}` 
        : "/api/banners";

      const response = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          imageUrl: data.imageUrl,
          isActive: data.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast.success(initialData ? "Banner updated successfully" : "Banner created successfully");
      router.push("/banners");
      router.refresh();
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {initialData ? "Editar Banner" : "Crear Banner"}
          </h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Titulo Banner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Imagen URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button disabled={loading} type="submit">
                  {initialData ? "Guardar Cambios" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
