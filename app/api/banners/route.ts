// app/api/banners/route.ts
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const banners = await prismadb.banner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('[BANNERS_GET]', error);
    return NextResponse.json(
      { error: 'Error fetching banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, imageUrl, isActive } = data;  

    if (!title || !imageUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const banner = await prismadb.banner.create({
      data: {
        title,
        imageUrl,     
        isActive,     
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('[BANNERS_POST]', error);
    return NextResponse.json(
      { error: 'Error creating banner' },
      { status: 500 }
    );
  }
}