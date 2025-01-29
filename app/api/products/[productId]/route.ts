// api/products/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest, 
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const producto = await prisma.producto.findUnique({
      where: { id: productId },
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
            orden: 'asc'
          }
        }
      }
    });

    if (!producto) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transformar los datos para que coincidan con la interfaz esperada
    const transformedProducto = {
      ...producto,
      categorias: producto.categorias.map(pc => pc.categoria),
      colores: producto.colores.map(pc => ({
        id: pc.color.id,
        nombre: pc.color.nombre,
        codigoHex: pc.color.codigo_hex
      })),
      marca: producto.marca[0]?.marca || null
    };

    return NextResponse.json(transformedProducto);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product details';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const data = await request.json();

    if (!data.nombre || !data.precio) {
      return NextResponse.json({ error: 'Nombre y precio son requeridos' }, { status: 400 });
    }

    // Primero, eliminamos las relaciones existentes
    await prisma.$transaction([
      prisma.productocategoria.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.productocolor.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.productomarca.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.imagenproducto.deleteMany({
        where: { id_producto: productId }
      })
    ]);

    // Luego, actualizamos el producto con las nuevas relaciones
    const producto = await prisma.producto.update({
      where: { id: productId },
      data: {
        nombre: data.nombre,
        precio: parseFloat(data.precio),
        descripcionCorta: data.descripcionCorta,
        descripcionLarga: data.descripcionLarga,
        slug: data.slug,
        destacado: data.destacado || false,
        updated_at: new Date(),
        categorias: {
          create: data.categoriaIds.map((id: number) => ({
            categoria: {
              connect: { id }
            }
          }))
        },
        colores: {
          create: data.colorIds.map((id: number) => ({
            color: {
              connect: { id }
            }
          }))
        },
        marca: {
          create: data.marcaIds.map((id: number) => ({
            marca: {
              connect: { id }
            }
          }))
        },
        imagenes: {
          create: data.imagenes?.map((imagen: any) => ({
            url: imagen.url,
            alt_text: imagen.altText || null,
            orden: imagen.orden,
            es_principal: imagen.esPrincipal
          })) || []
        }
      },
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
        imagenes: true
      }
    });

    // Transformar la respuesta para que coincida con la interfaz esperada
    const transformedProducto = {
      ...producto,
      categorias: producto.categorias.map(pc => pc.categoria),
      colores: producto.colores.map(pc => ({
        id: pc.color.id,
        nombre: pc.color.nombre,
        codigoHex: pc.color.codigo_hex
      })),
      marca: producto.marca[0]?.marca || null
    };

    return NextResponse.json(transformedProducto);
  } catch (error) {
    console.error('Error updating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    
    // Eliminar primero las relaciones
    await prisma.$transaction([
      prisma.productocategoria.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.productocolor.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.productomarca.deleteMany({
        where: { id_producto: productId }
      }),
      prisma.imagenproducto.deleteMany({
        where: { id_producto: productId }
      })
    ]);

    // Luego eliminar el producto
    await prisma.producto.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}