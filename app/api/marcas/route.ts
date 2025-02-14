import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    // Obtener todas las marcas desde la base de datos
    const marcas = await prismadb.marca.findMany();

    return NextResponse.json({
      message: "Marcas obtenidas correctamente",
      totalMarcas: marcas.length,
      marcas,
    });
  } catch (error) {
    console.error("Error obteniendo marcas:", error);
    return NextResponse.json(
      { error: "Error al obtener marcas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.idmarca || !data.nombre) {
      return NextResponse.json(
        { error: "idmarca y nombre son obligatorios" },
        { status: 400 }
      );
    }

    const idmarcaInt = parseInt(data.idmarca, 10);

    // Usamos upsert para actualizar si existe o crear si no
    const marca = await prismadb.marca.upsert({
      where: { idmarca: idmarcaInt },
      update: {
        nombre: data.nombre,
        imagen: data.imagen || null,
        
      },
      create: {
        idmarca: idmarcaInt,
        nombre: data.nombre,
        imagen: data.imagen || null,
       
      },
    });

    return NextResponse.json({
      message: "Marca sincronizada correctamente",
      marca,
    });
  } catch (error) {
    console.error("Error creando marca:", error);
    return NextResponse.json(
      { error: "Error al crear marca" },
      { status: 500 }
    );
  }
}
