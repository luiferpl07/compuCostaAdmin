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
import { Plus, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Producto {
  idproducto: string;
  nombreproducto: string;
  lista1?: number;
  lista2?: number;
  idmarca?: string;
  cantidad?: number;
  enBD?: boolean;
  descripcionLarga?: string;
  descripcionCorta?: string;
  categorias?: string;
  colores?: string;
  marca?: string;
  imagenes?: any[];
  estado?: string;
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
      setLoading(true);
      
      // Primero intentamos obtener los productos de la BD
      const dbResponse = await fetch("/api/products");
      const productosBD = await dbResponse.json();

      if (!dbResponse.ok) {
        throw new Error(productosBD.error || "Error al cargar productos de BD");
      }

      // Luego sincronizamos con la API externa
      const apiResponse = await fetch("/api/products/sync");
      const syncData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(syncData.error || "Error al sincronizar productos");
      }

      // Combinamos los productos
      const productosCombinados = (syncData.productos || []).map((producto: any) => {
        const productoBD = productosBD.find(
          (p: any) => p.idproducto === producto.idproducto
        );

        return {
          ...producto,
          enBD: !!productoBD,
          descripcionLarga: productoBD?.descripcionLarga || "",
          descripcionCorta: productoBD?.descripcionCorta || "",
          categorias: productoBD?.categorias || "Sin categoría",
          colores: productoBD?.colores || "Sin colores",
          marca: productoBD?.marca || "Sin marca",
          imagenes: productoBD?.imagenes || [],
          estado: productoBD
            ? productoBD.descripcionLarga && 
              productoBD.descripcionCorta && 
              productoBD.imagenes.length > 0
              ? "Completo"
              : "Incompleto"
            : "No guardado",
        };
      });

      setProductos(productosCombinados);
    } catch (error) {
      console.error("Error en fetchProductos:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idproducto: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`/api/products/${idproducto}`, {
        method: "DELETE",
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el producto");
      }

      toast.success("Producto eliminado correctamente");
      fetchProductos(); // Recargar la lista
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Productos</h2>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No hay productos disponibles
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Precio 2</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Colores</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.idproducto}>

                <TableCell>
                    {producto.imagenes && producto.imagenes.length > 0 ? (
                      <img 
                        src={producto.imagenes[0].url} 
                        alt={producto.nombreproducto}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{producto.idproducto}</TableCell>
                  <TableCell>{producto.nombreproducto}</TableCell>
                  <TableCell>
                    {producto.lista1 !== undefined
                      ? `$${Number(producto.lista1).toFixed(2)}`
                      : "Sin precio"}
                  </TableCell>
                  <TableCell>
                    {producto.lista2 !== undefined
                      ? `$${Number(producto.lista2).toFixed(2)}`
                      : "Sin precio"}
                  </TableCell>
                  <TableCell>{producto.categorias}</TableCell>
                  <TableCell>{producto.colores}</TableCell>
                  <TableCell>{producto.marca}</TableCell>
                  <TableCell>
                    <span
                      className={
                        producto.estado === "Completo"
                          ? "text-green-600"
                          : producto.estado === "Incompleto"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {producto.estado === "Completo"
                        ? "✅ Completo"
                        : producto.estado === "Incompleto"
                        ? "⚠️ Incompleto"
                        : "❌ No guardado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/products/${producto.idproducto}/edit`)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleEliminar(producto.idproducto)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}