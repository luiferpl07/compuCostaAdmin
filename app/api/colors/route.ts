// En /app/api/colors/route.ts
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, codigoHex } = body;

    console.log("Datos recibidos:", { nombre, codigoHex });

    if (!nombre || !codigoHex) {
      return new NextResponse("Faltan datos requeridos", { status: 400 });
    }

    // Verificar conexión a la base de datos
    try {
      await prismadb.$connect();
      console.log("Conexión a BD exitosa");
    } catch (dbError) {
      console.error("Error de conexión a BD:", dbError);
      return new NextResponse("Error de conexión a la base de datos", { status: 500 });
    }

    const color = await prismadb.color.create({
      data: {
        nombre,
        codigo_hex: codigoHex,
      }
    });

    console.log("Color creado:", color);
    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_POST] Error completo:', error);
    return new NextResponse(error instanceof Error ? error.message : "Error interno", { status: 500 });
  } finally {
    await prismadb.$disconnect();
  }
}

// Agregar un endpoint GET para obtener todos los colores
export async function GET() {
  try {
    await prismadb.$connect();
    const colores = await prismadb.color.findMany();
    return NextResponse.json(colores);
  } catch (error) {
    console.error('[COLORS_GET] Error completo:', error);
    return new NextResponse(error instanceof Error ? error.message : "Error interno", { status: 500 });
  } finally {
    await prismadb.$disconnect();
  }
}