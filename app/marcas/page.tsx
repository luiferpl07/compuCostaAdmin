"use client";

import { useState, useEffect } from "react";
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

// Definimos el tipo Category para evitar problemas de tipo implícito
interface Marca {
  id?: string;
  nombre: string;
  imagen: string;
}

export default function CategoriesPage() {
  const [marcas, setMarca] = useState<Marca[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);

  // Función para obtener las categorías desde la API
  const fetchMarcas = async () => {
    const response = await fetch('/api/marcas');
    const data = await response.json();
    setMarca(data);
  };

  // Efecto para obtener las categorías al cargar la página
  useEffect(() => {
    fetchMarcas();
  }, []);

  // Crear categoría
  const handleCreate = async (data: Marca) => {
    try {
      const response = await fetch('/api/marcas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchMarcas();
      }
    } catch (error) {
      console.error('Error creating marca:', error);
    }
  };

  // Actualizar categoría
  const handleUpdate = async (id: string, data: Marca) => {
    try {
      const response = await fetch(`/api/marcas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchMarcas();
      }
    } catch (error) {
      console.error('Error updating marca:', error);
    }
  };

  // Eliminar marca
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/marcas/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMarcas();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting marca:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Marcas</h2>
        {/* Se pasa la función handleCreate como prop */}
        <MarcaForm onSubmit={handleCreate} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marcas.map((marca) => (
              <TableRow key={marca.id}>
                <TableCell className="font-medium">{marca.nombre}</TableCell>
                <TableCell className="text-right">
                  {/* Pasamos las propiedades correctamente tipadas */}
                  <MarcaForm
                    mode="edit"
                    marca={marca}  // Propiedad correcta 'categoria'
                    onSubmit={(data) => handleUpdate(marca.id!, data)} // Aseguramos que 'id' no sea null
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

      {/* Confirmación para eliminar la categoría */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => marcaToDelete && handleDelete(marcaToDelete.id!)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
