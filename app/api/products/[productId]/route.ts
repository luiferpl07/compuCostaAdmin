import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface ImagenProducto {
  url: string;
  altText?: string;
  orden: number;
  esPrincipal: boolean;
}


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { idproducto: params.productId },
      include: {
        categorias: { include: { categoria: true } },
        colores: { include: { color: true } },
        marca: { include: { marca: true } },
        imagenes: { orderBy: { orden: "asc" } },
        reviews: true,
      },
    });

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      ...producto,
      lista1: producto.lista1?.toNumber(),
      lista2: producto.lista2?.toNumber(),
      porciva: producto.porciva?.toNumber(),
      categorias: producto.categorias.map(pc => pc.categoria.nombre).join(", ") || "Sin categoría",
      colores: producto.colores.map(pc => pc.color.nombre).join(", ") || "Sin colores",
      marca: producto.marca[0]?.marca.nombre || "Sin marca",
      reviews: producto.reviews || [],
    });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  context: { params: { productId?: string } }
) {
  try {
    const { params } = context;
    const productId = params?.productId;
    
    if (!productId) {
      console.log("❌ ID de producto no proporcionado");
      return NextResponse.json({ error: "ID de producto no encontrado" }, { status: 400 });
    }

    let data;
    try {
      data = await request.json();
      console.log("📥 Datos recibidos:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.log("❌ Error parseando JSON:", parseError);
      return NextResponse.json({ error: "Error en el formato de los datos" }, { status: 400 });
    }

    const productoExistente = await prisma.producto.findUnique({
      where: { idproducto: productId }
    });

    if (!productoExistente) {
      console.log("❌ Producto no encontrado:", productId);
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Eliminar relaciones existentes
    await prisma.$transaction([
      prisma.productocategoria.deleteMany({ 
        where: { id_producto: productoExistente.id } 
      }),
      prisma.productocolor.deleteMany({ 
        where: { id_producto: productoExistente.id } 
      }),
      prisma.productomarca.deleteMany({ 
        where: { id_producto: productoExistente.id } 
      }),
      prisma.imagenproducto.deleteMany({ 
        where: { id_producto: productId } 
      })
    ]);

    const updateData: Prisma.productoUpdateInput = {
      nombreproducto: data.nombreproducto,
      lista1: data.lista1 ? new Prisma.Decimal(data.lista1) : new Prisma.Decimal(0),
      lista2: data.lista2 ? new Prisma.Decimal(data.lista2) : null,
      porciva: data.porciva ? new Prisma.Decimal(data.porciva) : null,
      ivaincluido: data.ivaincluido ?? null,
      descripcionCorta: data.descripcionCorta ?? "",
      descripcionLarga: data.descripcionLarga ?? "",
      slug: data.slug || data.nombreproducto.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      destacado: data.destacado ?? false,
      cantidad: data.cantidad ?? 0,
      updated_at: new Date(),
      categorias: {
        create: data.categoriaIds?.map((id: number) => ({
          categoria: { connect: { id } }
        })) || []
      },
      colores: {
        create: data.colorIds?.map((id: number) => ({
          color: { connect: { id } }
        })) || []
      },
      marca: {
        create: data.marcaId ? [{ marca: { connect: { id: data.marcaId } } }] : []
      }
    };
    
    // Si hay imágenes, las agregamos al updateData
    if (Array.isArray(data.imagenes) && data.imagenes.length > 0) {
      updateData.imagenes = {
        create: data.imagenes.map((imagen: ImagenProducto, index: number) => ({
          url: imagen.url,
          alt_text: imagen.altText || null,
          orden: index,
          es_principal: imagen.esPrincipal || false
        }))
      };
    }
    const productoActualizado = await prisma.producto.update({
      where: { idproducto: productId },
      data: updateData,
      include: {
        categorias: { include: { categoria: true } },
        colores: { include: { color: true } },
        marca: { include: { marca: true } },
        imagenes: true
      }
    });

    const transformedProducto = {
      ...productoActualizado,
      categorias: productoActualizado.categorias?.map(pc => pc.categoria) || [],
      colores: productoActualizado.colores?.map(pc => ({
        id: pc.color.id,
        nombre: pc.color.nombre,
        codigoHex: pc.color.codigo_hex
      })) || [],
      marca: productoActualizado.marca?.[0]?.marca || null
    };

    return NextResponse.json(transformedProducto);
  } catch (error) {
    console.error("❌ Error general en PUT:", error instanceof Error ? error.message : 'Error desconocido');
    return NextResponse.json(
      { 
        error: "Error en el servidor", 
        details: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await prisma.producto.delete({
      where: { idproducto: params.productId }
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}