"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Marca {
  id: number;
  idmarca: number; 
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

interface ImageData {
  url: string;
  file?: File;
  previewUrl: string;
}

const formSchema = z.object({
  idproducto: z.string().min(1, "ID del producto es obligatorio"),
  nombreproducto: z.string().min(1, "Nombre del producto es obligatorio"),
  lista1: z.string().min(1, "El precio es obligatorio"),
  lista2: z.string().optional(),
  porciva: z.string().optional(),
  ivaincluido: z.enum(["S", "N"]).default("N"),
  descripcionLarga: z.string().optional(),
  descripcionCorta: z.string().optional(),
  slug: z.string().min(1, "Slug es obligatorio"),
  destacado: z.boolean().default(false),
  cantidad: z.number().min(0, "Cantidad debe ser un número positivo").default(0),
  categoriaIds: z.array(z.number()),
  colorIds: z.array(z.number()),
  marcaIds: z.array(z.number()),
  imagenes: z.array(z.object({ 
    url: z.string(),
    orden: z.number(),
    esPrincipal: z.boolean(),
    altText: z.string().optional()
  })).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [imagenPrincipal, setImagenPrincipal] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      idproducto: "",
      nombreproducto: "",
      lista1: "",
      lista2: "",
      porciva: "",
      ivaincluido: "N",
      descripcionLarga: "",
      descripcionCorta: "",
      slug: "",
      destacado: false,
      cantidad: 0,
      categoriaIds: [],
      colorIds: [],
      marcaIds: [],
      
    },
  });

  useEffect(() => {
    if (initialData?.imagenes) {
      setImages(initialData.imagenes.map(img => ({
        url: img.url,
        previewUrl: img.url
      })));
      
      const principalImage = initialData.imagenes.find(img => img.esPrincipal);
      if (principalImage) {
        setImagenPrincipal(principalImage.url);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, coloresRes, marcasRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/colors"),
          fetch("/api/marcas"),
        ]);
  
        const categoriasData = await categoriasRes.json();
        const coloresData = await coloresRes.json();
        const marcasData = await marcasRes.json();
  
        let marcasArray = marcasData;
        if (marcasData && typeof marcasData === 'object' && !Array.isArray(marcasData)) {
          if (marcasData.marcas) {
            marcasArray = marcasData.marcas;
          } else {
            marcasArray = Object.values(marcasData);
          }
        }
  
        setCategorias(categoriasData);
        setColores(coloresData);
        setMarcas(marcasArray);
      } catch (error) {
        console.error("❌ Error en fetchData:", error);
        toast.error("Error al cargar los datos del formulario");
      }
    };
  
    fetchData();
  }, []);
    
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
  
    setIsUploading(true);
    try {
      const newImages = Array.from(files).map((file) => ({
        url: "", // Se llenará después de subir la imagen
        file,
        previewUrl: URL.createObjectURL(file),
      }));
  
      setImages((prev) => [...prev, ...newImages]);
  
      console.log("📸 Imágenes agregadas al estado:", newImages);
    } catch (error) {
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleUrlAdd = () => {
    if (imageUrl.trim()) {
      setImages(prev => [...prev, {
        url: imageUrl.trim(),
        previewUrl: imageUrl.trim()
      }]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      if (newImages[index].previewUrl) {
        URL.revokeObjectURL(newImages[index].previewUrl);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSetPrincipal = (url: string) => {
    setImagenPrincipal(url);
  };

  const uploadImages = async (images: ImageData[], productId: string) => {
    const uploadedUrls = [];
  
    for (const image of images) {
      if (!image.file) continue;
  
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("productId", productId);
  
      console.log("📤 Subiendo imagen:", image.file.name);
  
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error al subir imagen: ${await response.text()}`);
        }
  
        const data = await response.json();
        uploadedUrls.push({
          url: data.path,
          orden: uploadedUrls.length,
          esPrincipal: image.previewUrl === imagenPrincipal,
          altText: data.altText || "",
        });
  
        console.log("✅ Imagen subida correctamente:", data.path);
      } catch (error) {
        console.error("❌ Error subiendo imagen:", error);
        toast.error("Error al subir imagen");
      }
    }
  
    return uploadedUrls;
  };

  const onSubmit = async (data: ProductFormValues) => {
    console.log("🟢 Botón presionado - Ejecutando onSubmit");
    console.log("📩 Datos del formulario:", data);
  
    if (!data || !data.idproducto) {
      console.error("❌ No hay datos en el formulario o falta el ID del producto");
      toast.error("Faltan datos del producto.");
      return;
    }
  
    try {
      setIsUploading(true);
  
      // 1️⃣ Filtrar imágenes nuevas
      const newImages = images.filter((img) => img.file);
      let imageUrls: { url: string; orden: number; esPrincipal: boolean; altText?: string }[] = [];
  
      if (newImages.length > 0) {
        imageUrls = await uploadImages(newImages, data.idproducto);
        console.log("📸 URLs de imágenes subidas:", imageUrls);
      }
  
      // 2️⃣ Formatear las imágenes correctamente
      const imagenesData = images.map((img, index) => {
        const uploadedImage = newImages.find((newImg) => newImg === img);
        return {
          url: uploadedImage ? imageUrls[newImages.indexOf(uploadedImage)]?.url : img.url,
          orden: index,
          esPrincipal: img.previewUrl === imagenPrincipal,
          altText: data.nombreproducto || "",
        };
      });
  
      console.log("🖼️ Imágenes a enviar:", imagenesData);
  
      // 3️⃣ Formatear los datos finales
      const finalData = {
        idproducto: data.idproducto,
        nombreproducto: data.nombreproducto,
        lista1: parseFloat(data.lista1) || 0,
        lista2: parseFloat(data.lista2 ?? "0") || 0,
        porciva: data.porciva ? parseFloat(data.porciva) : null,
        ivaincluido: data.ivaincluido || "N",
        descripcionLarga: data.descripcionLarga || "",
        descripcionCorta: data.descripcionCorta || "",
        slug: data.slug,
        destacado: Boolean(data.destacado),
        cantidad: Number(data.cantidad) || 0,
        categoriaIds: Array.isArray(data.categoriaIds) ? data.categoriaIds.map(id => Number(id)) : [],
        colorIds: Array.isArray(data.colorIds) ? data.colorIds.map(id => Number(id)) : [],
        marcaId: Array.isArray(data.marcaIds) && data.marcaIds.length > 0 ? data.marcaIds[0] : null,
        imagenes: imagenesData,
      };
  
      console.log("📤 Datos finales a enviar:", JSON.stringify(finalData, null, 2));
  
      // 4️⃣ Determinar si es edición o creación
      const isEditing = !!initialData?.idproducto;
      const endpoint = isEditing ? `/api/products/${data.idproducto}` : "/api/products";
  
      console.log("📌 Endpoint:", endpoint);
  
      // 5️⃣ Enviar datos al backend
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
  
      console.log("📩 Respuesta del servidor:", response);
  
      if (!response.ok) {
        const errorText = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: errorText || "Error desconocido" };
        }
  
        console.error("❌ Error en la respuesta del servidor:", parsedError);
        toast.error(parsedError.error || `Error ${response.status}: ${response.statusText}`);
        return;
      }
  
      toast.success("Producto guardado correctamente");
      router.push("/products");
  
    } catch (error) {
      console.error("❌ Error en onSubmit:", error);
      toast.error(error instanceof Error ? error.message : "Error al guardar el producto");
    } finally {
      setIsUploading(false);
    }
  };
  
  
  

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Campos básicos */}
              <FormField
                name="idproducto"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese ID del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                name="nombreproducto"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="lista1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lista2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio 2</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) ||  0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  name="porciva"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje IVA</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="ivaincluido"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IVA Incluido</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded"
                          {...field}
                        >
                          <option value="N">No</option>
                          <option value="S">Sí</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Descripciones */}
              <FormField
                name="descripcionLarga"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Larga</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción detallada del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="descripcionCorta"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Corta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción breve del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos adicionales */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="slug"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="url-amigable-del-producto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="cantidad"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                name="destacado"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Producto Destacado</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categorías, Marcas y Colores */}
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
                        field.onChange([parseInt(value)]);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(marcas) && marcas.length > 0 ? (
                          marcas.map((marca) => (
                            <SelectItem key={marca.idmarca} value={marca.idmarca.toString()}>
                              {marca.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <p className="text-gray-500 px-4 py-2">No hay marcas disponibles</p>
                        )}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((marcaId) => {
                        const marca = marcas.find(m => m.idmarca === marcaId);
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
              <div className="space-y-4">
                <FormLabel>Imágenes</FormLabel>
                
                {/* URL Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="URL de la imagen"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button type="button" onClick={handleUrlAdd}>
                    Agregar URL
                  </Button>
                </div>

                {/* File Upload */}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                {/* Image Preview */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.previewUrl}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity -100 transition-opacity">
                        <Button
                          type="button"
                          variant={imagenPrincipal === image.previewUrl ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleSetPrincipal(image.previewUrl)}
                        >
                          {imagenPrincipal === image.previewUrl ? "Principal" : "Set Principal"}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Guardando..." : "Guardar Producto"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}