import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PUT(
  request: Request,
  { params }: { params: { categoriesId: string } }
) {
  try {
    const data = await request.json();
    const category = await prismadb.categoria.update({
      where: { id: parseInt(params.categoriesId) },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        slug: data.slug,
        imagen: data.imagen,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { categoriesId: string } }
) {
  try {
    await prismadb.categoria.delete({
      where: { id: parseInt(params.categoriesId) },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error deleting category' },
      { status: 500 }
    );
  }
}