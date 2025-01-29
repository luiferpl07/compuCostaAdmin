import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
            orden: 'asc'
          }
        }
      }
    });

    // Transformar los datos incluyendo todos los campos
    const transformedProductos = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio.toNumber(),
      precioDescuento: producto.precioDescuento?.toNumber() || null,
      destacado: producto.destacado,
      cantidad: producto.cantidad,
      vistaGeneral: producto.vistaGeneral,
      enStock: producto.enStock,
      esNuevo: producto.esNuevo,
      descripcionCorta: producto.descripcionCorta,
      descripcionLarga: producto.descripcionLarga,
      slug: producto.slug,
      puntuacionPromedio: producto.puntuacionPromedio,
      reseñasCount: producto.reseñasCount,
      marca: producto.marca[0]?.marca || null,
      categorias: producto.categorias.map(pc => pc.categoria),
      colores: producto.colores.map(pc => ({
        id: pc.color.id,
        nombre: pc.color.nombre,
        codigoHex: pc.color.codigo_hex
      })),
      imagenes: producto.imagenes.map(img => ({
        url: img.url,
        altText: img.alt_text || undefined,
        esPrincipal: img.es_principal,
        orden: img.orden
      }))
    }));

    return NextResponse.json(transformedProductos);
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('Datos recibidos:', data);

    if (!data.nombre || !data.precio) {
      return NextResponse.json({ error: 'Nombre y precio son requeridos' }, { status: 400 });
    }

    const producto = await prisma.producto.create({
      data: {
        id: data.id,
        nombre: data.nombre,
        precio: parseFloat(data.precio),
        precioDescuento: data.precioDescuento ? parseFloat(data.precioDescuento) : null,
        descripcionCorta: data.descripcionCorta,
        descripcionLarga: data.descripcionLarga,
        slug: data.slug,
        destacado: data.destacado || false,
        // Nuevos campos
        cantidad: data.cantidad || 0,
        vistaGeneral: data.vistaGeneral,
        enStock: data.enStock ?? true,
        esNuevo: data.esNuevo || false,
        puntuacionPromedio: 0.0,  // Valor inicial
        reseñasCount: 0,          // Valor inicial
        updated_at: new Date(),
        // Relaciones
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

    console.log('Producto creado:', producto);

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}