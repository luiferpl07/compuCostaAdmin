"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import ProductForm from "@/components/forms/product-form";
import { toast } from "sonner";

interface ImagenProducto {
  url: string;
  altText?: string;
  esPrincipal: boolean;
  orden: number;
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

// Interface para los datos crudos del producto como vienen de la API
interface ProductAPI {
  id: number;
  idproducto: string;
  nombreproducto: string;
  lista1?: number;
  lista2?: number;
  porciva?: number;
  ivaincluido?: string;
  descripcionLarga?: string;
  descripcionCorta?: string;
  slug?: string;
  destacado: boolean;
  cantidad: number;
  created_at: string;
  updated_at: string;
  categorias: any;
  colores: any;
  marca: any;
  imagenes?: ImagenProducto[];
}

// Interface para los datos transformados que espera el ProductForm
interface ProductFormData {
  idproducto: string;
  nombreproducto: string;
  lista1: string;
  lista2: string;
  porciva?: string;
  ivaincluido: "S" | "N";
  descripcionLarga?: string;
  descripcionCorta?: string;
  slug: string;
  destacado: boolean;
  cantidad: number;
  categoriaIds: number[];
  colorIds: number[];
  marcaIds: number[];
  imagenes?: ImagenProducto[];
}

// Tipo auxiliar para los items que pueden tener un id
interface ItemWithId {
  id: number;
  [key: string]: any;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data: ProductAPI = await response.json();

        console.log("Datos recibidos de la API:", data);

        // Función auxiliar para extraer IDs de manera segura
        const extractIds = (field: any): number[] => {
          if (!field) return [];
          
          // Si es un array
          if (Array.isArray(field)) {
            return field.map(item => {
              if (typeof item === 'number') return item;
              if (typeof item === 'object' && item !== null && 'id' in item) {
                return (item as ItemWithId).id;
              }
              return 0; // Valor por defecto si no se puede extraer el ID
            }).filter(id => id !== 0);
          }
          
          // Si es un objeto
          if (typeof field === 'object' && field !== null) {
            return Object.values(field)
              .map(item => {
                if (typeof item === 'number') return item;
                if (typeof item === 'object' && item !== null && 'id' in item) {
                  return (item as ItemWithId).id;
                }
                return 0;
              })
              .filter(id => id !== 0);
          }
          
          return [];
        };

        // Transformar los datos al formato que espera el ProductForm
        const productData: ProductFormData = {
          idproducto: data.idproducto,
          nombreproducto: data.nombreproducto,
          lista1: data.lista1?.toString() || "",
          lista2: data.lista2?.toString() || "",
          porciva: data.porciva?.toString(),
          ivaincluido: (data.ivaincluido as "S" | "N") || "N",
          descripcionLarga: data.descripcionLarga || "",
          descripcionCorta: data.descripcionCorta || "",
          slug: data.slug || "",
          destacado: Boolean(data.destacado),
          cantidad: data.cantidad || 0,
          categoriaIds: extractIds(data.categorias),
          colorIds: extractIds(data.colores),
          marcaIds: data.marca ? 
            (Array.isArray(data.marca) ? extractIds(data.marca) : 
              (typeof data.marca === 'object' && data.marca !== null && 'id' in data.marca) ? 
                [data.marca.id] : []) 
            : [],
          imagenes: data.imagenes || [],
        };

        console.log("Datos transformados para el formulario:", productData);
        setProduct(productData);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Producto no encontrado</div>
      </div>
    );
  }

  return <ProductForm initialData={product} />;
}