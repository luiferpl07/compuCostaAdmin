import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categorias: { 
          include: { 
            categoria: true 
          } 
        },
        colores: { 
          include: { 
            color: true 
          } 
        },
        marca: { 
          include: { 
            marca: true 
          } 
        },
        imagenes: { 
          orderBy: { 
            orden: "asc" 
          } 
        },
      },
    });

    // Transformar los datos antes de enviarlos
    const productosFormateados = productos.map(producto => ({
      ...producto,
      lista1: producto.lista1?.toNumber(),
      lista2: producto.lista2?.toNumber(),
      porciva: producto.porciva?.toNumber(),
      categorias: producto.categorias.map(pc => pc.categoria.nombre).join(", ") || "Sin categoría",
      colores: producto.colores.map(pc => pc.color.nombre).join(", ") || "Sin colores",
      marca: producto.marca[0]?.marca.nombre || "Sin marca"
    }));

    return NextResponse.json(productosFormateados);

  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener productos",
        details: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error al desconectar de la base de datos:", disconnectError);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validación de datos
    if (!data.idproducto || !data.nombreproducto || !data.lista1 || !data.lista2) {
      return NextResponse.json(
        { error: "ID, Nombre y Precio son requeridos" },
        { status: 400 }
      );
    }

    // Asegúrate de que lista1 y lista2 sean números
    if (typeof data.lista1 !== 'number' || typeof data.lista2 !== 'number') {
      return NextResponse.json(
        { error: "Lista1 y Lista2 deben ser números" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.producto.create({
      data: {
        idproducto: data.idproducto,
        nombreproducto: data.nombreproducto,
        lista1: data.lista1,
        lista2: data.lista2,
        porciva: data.porciva || null,
        ivaincluido: data.ivaincluido || null,
        cantidad: data.cantidad || 0,
        descripcionLarga: data.descripcionLarga || "",
        descripcionCorta: data.descripcionCorta || "",
        slug: data.slug || data.nombreproducto.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        destacado: data.destacado || false,
      },
    });

    return NextResponse.json({
      ...newProduct,
      lista1: newProduct.lista1?.toNumber(),
      porciva: newProduct.porciva?.toNumber()
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { 
        error: "Error al crear producto",
        details: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error al desconectar de la base de datos:", disconnectError);
    }
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { idproducto } = await request.json();

    if (!idproducto) {
      return NextResponse.json(
        { error: "ID del producto es requerido" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.producto.findUnique({
      where: { idproducto },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    await prisma.producto.delete({
      where: { idproducto },
    });

    return NextResponse.json({ 
      success: true,
      message: "Producto eliminado correctamente" 
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { 
        error: "Error al eliminar producto",
        details: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error al desconectar de la base de datos:", disconnectError);
    }
  }
}