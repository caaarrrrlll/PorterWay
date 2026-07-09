import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone'); // Obtenemos la zona de la URL

  try {
    const porters = await prisma.user.findMany({
      where: {
        role: { code: 'PORTER' },
        ...(zone && { zone: zone }) // Solo filtra por zona si el parámetro existe
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      }
    });

    return NextResponse.json({ success: true, data: porters });
  } catch (error) {
    console.error("Error al cargar porters:", error);
    return NextResponse.json({ success: false, error: 'Error al obtener transportistas' }, { status: 500 });
  }
}