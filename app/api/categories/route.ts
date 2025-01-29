// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const categories = await prismadb.categoria.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const category = await prismadb.categoria.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        slug: data.slug,
        imagen: data.imagen,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
}
