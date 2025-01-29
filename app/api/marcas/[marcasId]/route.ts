import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PUT(
  request: Request,
  { params }: { params: { marcasId: string } }
) {
  try {
    const data = await request.json();
    const marca = await prismadb.marca.update({
      where: { id: parseInt(params.marcasId) },
      data: {
        nombre: data.nombre,
        imagen: data.imagen,
      },
    });
    return NextResponse.json(marca);
  } catch (error) {
    console.error('Error updating marca:', error);
    return NextResponse.json(
      { error: 'Error updating marca' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { marcasId: string } }
) {
  try {
    await prismadb.marca.delete({
      where: { id: parseInt(params.marcasId) },
    });
    return NextResponse.json({ message: 'Marca deleted successfully' });
  } catch (error) {
    console.error('Error deleting marca:', error);
    return NextResponse.json(
      { error: 'Error deleting marca' },
      { status: 500 }
    );
  }
}