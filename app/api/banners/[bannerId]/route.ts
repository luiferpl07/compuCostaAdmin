import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {
    if (!params.bannerId) {
      return new NextResponse("Banner id is required", { status: 400 });
    }
 

    const banner = await prismadb.banner.findUnique({
      where: {
        id: parseInt(params.bannerId), // Usar el ID convertido
      },
    });

    if (!banner) {
      return new NextResponse("Banner not found", { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[BANNER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {
    const body = await req.json();
    const { title, imageUrl, isActive } = body;

    if (!title || !imageUrl || !isActive) {
      return new NextResponse("Faltan datos requeridos", { status: 400 });
    }

    
    const updatedBanner = await prismadb.banner.update({
      where: {
        id: parseInt(params.bannerId), 
      },
      data: {
        title,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('[BANNER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {
    if (!params.bannerId) {
      return new NextResponse("Banner id is required", { status: 400 });
    }

    const bannerId = params.bannerId ; // Convertir a número

    const banner = await prismadb.banner.delete({
      where: {
        id: parseInt(bannerId), // Usar el ID convertido
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[BANNER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}