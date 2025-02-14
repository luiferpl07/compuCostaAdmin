"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm , SubmitHandler } from "react-hook-form";
import { Plus } from "lucide-react";

interface Categoria {
  nombre: string;
  descripcion: string;
  slug: string;
  imagen: string;
}

interface CategoryFormProps {
  categoria?: Categoria;
  mode?: "create" | "edit";
  onSubmit: (data: Categoria) => Promise<void>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoria,
  mode = "create",
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<Categoria>({
    defaultValues: {
      nombre: categoria?.nombre || "",
      descripcion: categoria?.descripcion || "",
      slug: categoria?.slug || "",
      imagen: categoria?.imagen || "",
    },
  });

  const handleSubmit: SubmitHandler<Categoria> = async (data) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {mode === "create" ? "Crear Categoria" : "Editar Categoria"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Categoria" : "Editar Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripcion categoria"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug-categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {mode === "create" ? "Crear" : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;