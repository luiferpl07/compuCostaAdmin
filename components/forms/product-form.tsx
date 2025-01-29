"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, X } from "lucide-react";
import { slugify } from "@/lib/utils";


interface ImagenProducto {
  url: string;
  orden: number;
  esPrincipal: boolean;
  altText?: string;
}

interface Marca {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Color {
  id: number;
  nombre: string;
  codigoHex: string;
}
const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  nombre: z.string().min(1, "Name is required"),
  precio: z.string().min(1, "Price is required"),
  descripcionLarga: z.string().optional(),
  descripcionCorta: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  destacado: z.boolean().default(false),
  // Nuevos campos
  codigoBase: z.string().optional(),
  cantidad: z.number().min(0, "Quantity must be positive").default(0),
  vistaGeneral: z.string().optional(),
  enStock: z.boolean().default(true),
  esNuevo: z.boolean().default(false),
  precioDescuento: z.string().optional(),
  // Campos relacionales existentes
  categoriaIds: z.array(z.number()),
  colorIds: z.array(z.number()),
  marcaIds: z.array(z.number()),
  imagenes: z.array(z.object({
    url: z.string(),
    orden: z.number(),
    esPrincipal: z.boolean()
  })).optional()
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
}

// Función para subir imágenes al servidor
const saveImageLocally = async (file: File, productId: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productId', productId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.path; // Devuelve la ruta de la imagen subida
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const [existingImages, setExistingImages] = useState<ImagenProducto[]>(
    initialData?.imagenes || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagenPrincipal, setImagenPrincipal] = useState<string | null>(
    initialData?.imagenes?.find(img => img.esPrincipal)?.url || null
  );
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [imagenes, setImagenes] = useState<File[]>([]);
 
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: "",
      nombre: "",
      precio: "",
      descripcionLarga: "",
      descripcionCorta: "",
      slug: "",
      destacado: false,
      // Nuevos campos
      codigoBase: "",
      cantidad: 0,
      vistaGeneral: "",
      enStock: true,
      esNuevo: false,
      precioDescuento: "",
      // Campos relacionales existentes
      categoriaIds: [],
      colorIds: [],
      marcaIds: [],
      imagenes: []
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "nombre") {
        form.setValue("slug", slugify(value.nombre || ""));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, coloresRes, marcasRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/colors"),
          fetch("/api/marcas")
        ]);
        
        const categoriasData = await categoriasRes.json();
        const coloresData = await coloresRes.json();
        const marcasData = await marcasRes.json();
        
        setCategorias(categoriasData);
        setColores(coloresData);
        setMarcas(marcasData);
      } catch (error) {
        toast.error("Error loading form data");
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImagenes(fileArray);
    }
  };

  const handleSetPrincipal = (url: string) => {
    setImagenPrincipal(url);
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
  
      // Validación inicial de datos requeridos
      if (!data.id || !data.nombre || !data.precio) {
        toast.error("Faltan campos requeridos");
        return;
      }
  
      // Validar que haya al menos una categoría y una marca
      if (data.categoriaIds.length === 0 || data.marcaIds.length === 0) {
        toast.error("Debe seleccionar al menos una categoría y una marca");
        return;
      }
  
      // Validar que haya imágenes para subir
      if (imagenes.length === 0) {
        toast.error("Debe agregar al menos una imagen");
        return;
      }
  
      try {
        // Subir imágenes al servidor
        console.log('Iniciando subida de imágenes...');
        const imagePromises = imagenes.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('productId', data.id);
  
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (!uploadResponse.ok) {
            throw new Error(`Error al subir imagen: ${uploadResponse.statusText}`);
          }
  
          const uploadData = await uploadResponse.json();
          return uploadData.path;
        });
  
        const imageUrls = await Promise.all(imagePromises);
        console.log('URLs de imágenes subidas:', imageUrls);
  
        // Crear el objeto de imágenes
        const imagenesData = imageUrls.map((url, index) => ({
          url,
          orden: index,
          esPrincipal: url === imagenPrincipal,
          altText: data.nombre
        }));
  
        // Preparar el payload
        const payload = {
          ...data,
          precio: parseFloat(data.precio),
          precioDescuento: data.precioDescuento ? parseFloat(data.precioDescuento) : null,
          imagenes: imagenesData,
          categoriaIds: data.categoriaIds.map(Number),
          colorIds: data.colorIds.map(Number),
          marcaIds: data.marcaIds.map(Number)
        };
  
        console.log('Payload a enviar:', JSON.stringify(payload, null, 2));
  
        // Enviar los datos al servidor
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        // Manejar la respuesta
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          
          throw new Error(
            `Error ${response.status}: ${errorText || response.statusText || 'Error desconocido'}`
          );
        }
  
        const responseData = await response.json();
        console.log('Respuesta exitosa:', responseData);
  
        toast.success("Producto creado exitosamente");
        router.push("/products");
        router.refresh();
  
      } catch (uploadError) {
        console.error('Error en el proceso:', uploadError);
        throw new Error(uploadError instanceof Error ? uploadError.message : 'Error en el proceso de subida');
      }
  
    } catch (error) {
      console.error('Error completo:', error);
      toast.error(error instanceof Error ? error.message : "Error al crear el producto");
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
            {initialData ? "Editar Producto" : "Crear Producto"}
          </h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ID Manual */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese ID " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Información del producto */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del producto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Descripción */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="descripcionCorta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Corta</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción breve" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcionLarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Larga</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción detallada" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>      

              <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="cantidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vistaGeneral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vista General</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Vista general del producto" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="precioDescuento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio con Descuento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="enStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>En Stock</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="esNuevo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Es Nuevo</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destacado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Destacado</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Categorías y colores */}
              <FormField
                control={form.control}
                name="categoriaIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorías</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentIds = field.value;
                        const newValue = parseInt(value);
                        if (!currentIds.includes(newValue)) {
                          field.onChange([...currentIds, newValue]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categorías" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id.toString()}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((categoriaId) => {
                        const categoria = categorias.find(c => c.id === categoriaId);
                        return (
                          <Badge key={categoriaId} variant="secondary">
                            {categoria?.nombre}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(field.value.filter(id => id !== categoriaId));
                              }}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marcaIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Cambiamos para manejar una sola marca
                        field.onChange([parseInt(value)]);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcas.map((marca) => (
                          <SelectItem key={marca.id} value={marca.id.toString()}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((marcaId) => {
                        const marca = marcas.find(m => m.id === marcaId);
                        return (
                          <Badge key={marcaId} variant="secondary">
                            {marca?.nombre}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange([]);
                              }}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colorIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colores</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentIds = field.value;
                        const newValue = parseInt(value);
                        if (!currentIds.includes(newValue)) {
                          field.onChange([...currentIds, newValue]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar colores" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colores.map((color) => (
                          <SelectItem key={color.id} value={color.id.toString()}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color.codigoHex }}
                              />
                              {color.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((colorId) => {
                        const color = colores.find(c => c.id === colorId);
                        return (
                          <Badge
                            key={colorId}
                            variant="secondary"
                            style={{
                              backgroundColor: color?.codigoHex,
                              color: '#fff',
                            }}
                          >
                            {color?.nombre}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(field.value.filter(id => id !== colorId));
                              }}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Imágenes */}
              <div>
  <FormLabel>Imágenes</FormLabel>
  <input 
    type="file" 
    multiple 
    onChange={handleImageUpload} 
    className="mb-4"
  />
  
  {/* Imágenes existentes */}
  <div className="grid grid-cols-4 gap-4 mb-4">
    {existingImages.map((img, index) => (
      <div key={`existing-${index}`} className="relative">
        <img 
          src={img.url} 
          alt={img.altText || "Producto"} 
          className="w-full h-32 object-cover rounded-md"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 ${
            img.esPrincipal ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleSetPrincipal(img.url)}
        >
          {img.esPrincipal ? "Principal" : "Set Principal"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="absolute bottom-2 right-2"
          onClick={() => {
            setExistingImages(prev => 
              prev.filter(i => i.url !== img.url)
            );
          }}
        >
          Eliminar
        </Button>
      </div>
    ))}
  </div>

  {/* Nuevas imágenes */}
  <div className="grid grid-cols-4 gap-4">
    {newImages.map((img, index) => {
      const imageUrl = URL.createObjectURL(img);
      return (
        <div key={`new-${index}`} className="relative">
          <img 
            src={imageUrl} 
            alt="Nueva imagen" 
            className="w-full h-32 object-cover rounded-md"
          />
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 ${
              imagenPrincipal === imageUrl ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => handleSetPrincipal(imageUrl)}
          >
            {imagenPrincipal === imageUrl ? "Principal" : "Set Principal"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={() => {
              setNewImages(prev => 
                prev.filter((_, i) => i !== index)
              );
            }}
          >
            Eliminar
          </Button>
        </div>
                    );
                  })}
                </div>
              </div>

              {/* Botones */}
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Producto"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}