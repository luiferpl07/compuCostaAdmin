// app/api/marca/route.ts
import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const marcas = await prismadb.marca.findMany();
    return NextResponse.json(marcas);
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
    const marca = await prismadb.marca.create({
      data: {
        nombre: data.nombre,
        imagen: data.imagen,
      },
    });
    return NextResponse.json(marca);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating marca' },
      { status: 500 }
    );
  }
}
