import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const apiUrl = process.env.EXTERNAL_API_URL;
    const username = process.env.EXTERNAL_API_USERNAME;
    const password = process.env.EXTERNAL_API_PASSWORD;

    if (!apiUrl || !username || !password) {
      throw new Error("Configuración de API externa incompleta");
    }

    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    const responseAPI = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!responseAPI.ok) {
      throw new Error(`Error en la API externa: ${responseAPI.status}`);
    }

    const { detProducto: productosAPI } = await responseAPI.json();

    await Promise.all(
      productosAPI.map(async (apiProduct: any) => {
        try {
          await prisma.producto.upsert({
            where: { idproducto: apiProduct.idproducto },
            update: {
              nombreproducto: apiProduct.nombreproducto,
              lista1: apiProduct.lista1,
              lista2: apiProduct.lista2,
              porciva: apiProduct.porciva,
              ivaincluido: apiProduct.ivaincluido,
              updated_at: new Date(),
            },
            create: {
              idproducto: apiProduct.idproducto,
              nombreproducto: apiProduct.nombreproducto,
              lista1: apiProduct.lista1,
              lista2: apiProduct.lista2,
              porciva: apiProduct.porciva,
              ivaincluido: apiProduct.ivaincluido,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        } catch (error) {
          console.error("Error sincronizando producto:", apiProduct.idproducto, error);
        }
      })
    );

    const productosGuardados = await prisma.producto.findMany();

    return NextResponse.json({
      message: "Sincronización completada",
      totalProductos: productosGuardados.length,
      productos: productosGuardados.map(p => ({
        ...p,
        lista1: p.lista1?.toNumber(),
        lista2: p.lista2?.toNumber(),
        porciva: p.porciva?.toNumber()
      })),
    });
  } catch (error) {
    console.error("Error en sincronización:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}