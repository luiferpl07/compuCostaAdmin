"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface Color {
  id: number;
  nombre: string;
  codigoHex: string;  // Ajustado para coincidir con el modelo
}

interface Marca {
  id: number;
  nombre: string;
  imagen?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioDescuento?: number;
  destacado: boolean;
  cantidad: number;
  vistaGeneral?: string;
  enStock: boolean;
  esNuevo: boolean;
  marca?: Marca;
  categorias: Categoria[];
  colores: Color[];
  imagenes: Array<{
    url: string;
    altText?: string;
    esPrincipal: boolean;
    orden: number;
  }>;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        throw new Error("La respuesta de la API no es un array");
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.message || "No se pudieron cargar los productos"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
  
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        toast.success("Producto eliminado");
        fetchProductos();
      } else {
        throw new Error("Error al eliminar");
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.message || "No se pudo eliminar"}`);
    }
  };

  const getImageUrl = (url: string) => {
    // Si la URL ya es absoluta (comienza con http o https), la devolvemos tal cual
    if (url.startsWith('http')) {
      return url;
    }
    // Si es una ruta local (comienza con /uploads), la convertimos en ruta absoluta
    if (url.startsWith('/uploads')) {
      // Asumiendo que tu aplicación se ejecuta en localhost:3000
      return `${window.location.origin}${url}`;
    }
    // Si no cumple ninguna condición, devolvemos la URL tal cual
    return url;
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
  
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
             
              <TableHead>Nombre</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Categorías</TableHead>
              <TableHead>Colores</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <div className="relative h-20 w-20">
                    {producto.imagenes && producto.imagenes.length > 0 ? (
                      <Image
                        src={getImageUrl(producto.imagenes.find(img => img.esPrincipal)?.url || producto.imagenes[0].url)}
                        alt={producto.imagenes[0].altText || producto.nombre}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{producto.nombre}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className={`text-sm ${producto.enStock ? 'text-green-600' : 'text-red-600'}`}>
                      {producto.enStock ? 'En Stock' : 'Sin Stock'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Cant: {producto.cantidad}
                    </span>
                  </div>
                </TableCell>
                <TableCell>${Number(producto.precio).toFixed(2)}</TableCell>
                <TableCell>
                  {producto.precioDescuento ? (
                    <span className="text-green-600">
                      ${Number(producto.precioDescuento).toFixed(2)}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                
                <TableCell>{producto.marca?.nombre || 'Sin marca'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {producto.categorias?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {producto.categorias.map((categoria, index) => (
                          <span
                            key={`${categoria.id}-${index}`}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {categoria.nombre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Sin categorías</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {producto.colores?.map((color, index) => (
                      <div
                        key={`${color.id}-${index}`}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color.codigoHex }}
                        title={color.nombre}
                      />
                    ))}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => router.push(`/products/${producto.id}/colors`)}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/products/${producto.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEliminar(producto.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}