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

interface Marca {
  nombre: string;
  
  imagen: string;
}

interface MarcaFormProps {
  marca?: Marca;
  mode?: "create" | "edit";
  onSubmit: (data: Marca) => Promise<void>;
}

const MarcaForm: React.FC<MarcaFormProps> = ({
  marca,
  mode = "create",
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<Marca>({
    defaultValues: {
      nombre: marca?.nombre || "",
      
      imagen: marca?.imagen || "",
    },
  });

  const handleSubmit: SubmitHandler<Marca> = async (data) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {mode === "create" ? "Agregar Marcar" : "Editar Marca"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Agregar Marcar" : "Editar Marca"}
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
                    <Input placeholder="Nombre Marca " {...field} />
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
              {mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MarcaForm;