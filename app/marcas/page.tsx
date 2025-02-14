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
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import MarcaForm from "@/components/forms/marca-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Definimos el tipo Marca
interface Marca {
  idmarca: string;
  nombre: string;
  imagen?: string;
  enBD?: boolean;
  estado?: string;
}

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      setLoading(true);

      // Obtener marcas desde la BD
      const dbResponse = await fetch("/api/marcas");
      const dataBD = await dbResponse.json();

      if (!dbResponse.ok) {
        throw new Error(dataBD.error || "Error al cargar marcas de BD");
      }

      if (!Array.isArray(dataBD.marcas)) {
        throw new Error("La API /api/marcas no devolvió un array.");
      }

      // Sincronizar con la API externa
      const apiResponse = await fetch("/api/marcas/sync");
      const syncData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(syncData.error || "Error al sincronizar marcas");
      }

      if (!Array.isArray(syncData.marcas)) {
        throw new Error("La API /api/marcas/sync no devolvió un array.");
      }

      // Combinar datos de la BD y la API externa
      const marcasCombinadas = syncData.marcas.map((marcaAPI: any) => {
        const marcaBD = dataBD.marcas.find((m: any) => m.idmarca === marcaAPI.idmarca);

        return {
          ...marcaAPI,
          enBD: !!marcaBD,
          imagen: marcaBD?.imagen || "",
          estado: marcaBD ? "Guardada" : "No guardada",
        };
      });

      setMarcas(marcasCombinadas);
    } catch (error) {
      console.error("❌ Error en fetchMarcas:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva marca
  const handleCreate = async (data: Omit<Marca, "idmarca">) => {
    try {
      const response = await fetch("/api/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear la marca");
      toast.success("Marca creada correctamente");
      fetchMarcas();
    } catch (error) {
      console.error("Error creando marca:", error);
      toast.error("Error al crear la marca");
    }
  };

  // Actualizar marca existente
  const handleUpdate = async (idmarca: string, data: Omit<Marca, "idmarca">) => {
    try {
      const response = await fetch(`/api/marcas/${idmarca}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar la marca");
      toast.success("Marca actualizada correctamente");
      fetchMarcas();
    } catch (error) {
      console.error("Error actualizando marca:", error);
      toast.error("Error al actualizar la marca");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Marcas</h2>
        <MarcaForm onSubmit={handleCreate} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marcas.map((marca) => (
              <TableRow key={marca.idmarca}>
                <TableCell>{marca.nombre}</TableCell>
                <TableCell>
                  {marca.estado === "Guardada" ? "✅ Guardada" : "❌ No guardada"}
                </TableCell>
                <TableCell className="text-right flex gap-2">
                  <MarcaForm
                    mode="edit"
                    marca={marca}
                    onSubmit={(data) => handleUpdate(marca.idmarca, data)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setMarcaToDelete(marca);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la marca permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => marcaToDelete && handleUpdate(marcaToDelete.idmarca, { nombre: "Eliminado" })}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
