import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PUT(request: Request, { params }: { params: { marcasId: string } }) {
  try {
    const data = await request.json();
    const id = parseInt(params.marcasId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const existingMarca = await prismadb.marca.findUnique({ where: { id } });

    if (!existingMarca) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    }

    const marca = await prismadb.marca.update({
      where: { id },
      data: {
        nombre: data.nombre,
        imagen: data.imagen,
      },
    });

    return NextResponse.json(marca);
  } catch (error) {
    console.error('Error updating marca:', error);
    return NextResponse.json({ error: 'Error updating marca' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { marcasId: string } }) {
  try {
    const id = parseInt(params.marcasId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const existingMarca = await prismadb.marca.findUnique({ where: { id } });

    if (!existingMarca) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    }

    await prismadb.marca.delete({ where: { id } });

    return NextResponse.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting marca:', error);
    return NextResponse.json({ error: 'Error deleting marca' }, { status: 500 });
  }
}
