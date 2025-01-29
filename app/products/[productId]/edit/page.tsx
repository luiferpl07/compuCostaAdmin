"use client";
import { useEffect, useState } from "react";
import ProductForm from "@/components/forms/product-form";

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

interface Product {
  id: string;
  nombre: string;
  precio: string;
  descripcionLarga?: string;
  descripcionCorta?: string;
  slug: string;
  destacado: boolean;
  codigoBase?: string;
  cantidad: number;
  vistaGeneral?: string;
  enStock: boolean;
  esNuevo: boolean;
  precioDescuento?: string;
  categoriaIds: number[];
  colorIds: number[];
  marcaIds: number[];
  imagenes?: ImagenProducto[];
  // Agregamos las relaciones completas
  marca?: Marca;
  categorias?: Categoria[];
  colores?: Color[];
}

interface ProductAPIResponse {
  id: string;
  nombre: string;
  precio: number;
  descripcionLarga?: string;
  descripcionCorta?: string;
  slug?: string;
  destacado?: boolean;
  codigoBase?: string;
  cantidad?: number;
  vistaGeneral?: string;
  enStock?: boolean;
  esNuevo?: boolean;
  precioDescuento?: number;
  categoriaIds?: number[];
  colorIds?: number[];
  marcaIds?: number[];
  imagenes?: {
    url: string;
    altText?: string;
    esPrincipal?: boolean;
    orden?: number;
  }[];
  // Agregamos las relaciones completas en la respuesta
  marca?: Marca;
  categorias?: Categoria[];
  colores?: Color[];
}

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.productId);
    };
    
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data: ProductAPIResponse = await response.json();

        // Transformar los datos para que coincidan con el formato del formulario
        const productData: Product = {
          id: data.id,
          nombre: data.nombre,
          precio: data.precio.toString(),
          descripcionLarga: data.descripcionLarga || "",
          descripcionCorta: data.descripcionCorta || "",
          slug: data.slug || "",
          destacado: data.destacado || false,
          codigoBase: data.codigoBase || "",
          cantidad: data.cantidad || 0,
          vistaGeneral: data.vistaGeneral || "",
          enStock: data.enStock ?? true,
          esNuevo: data.esNuevo || false,
          precioDescuento: data.precioDescuento?.toString() || "",
          // Extraemos los IDs de las relaciones existentes
          categoriaIds: data.categorias?.map(cat => cat.id) || [],
          colorIds: data.colores?.map(col => col.id) || [],
          marcaIds: data.marca ? [data.marca.id] : [],
          // Guardamos también las relaciones completas
          categorias: data.categorias || [],
          colores: data.colores || [],
          marca: data.marca,
          imagenes: data.imagenes?.map((img): ImagenProducto => ({
            url: img.url,
            altText: img.altText || "",
            esPrincipal: img.esPrincipal || false,
            orden: img.orden || 0
          })) || []
        };

        setProduct(productData);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
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