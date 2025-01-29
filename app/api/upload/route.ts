import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId');

    // Validar campos obligatorios
    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Missing file or productId' },
        { status: 400 }
      );
    }

    // Crear directorio de subidas
    const uploadDir = join(process.cwd(), 'public', 'uploads', productId.toString());
    await mkdir(uploadDir, { recursive: true });

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = join(uploadDir, uniqueName);

    // Convertir archivo a buffer y guardar
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, new Uint8Array(bytes))

    // Devolver ruta pública
    const publicUrl = `/uploads/${productId}/${uniqueName}`;
    return NextResponse.json({ path: publicUrl });

  } catch (error) {
    console.error('Error en la subida:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}