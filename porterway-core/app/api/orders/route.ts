import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

async function generateNextOrderCode() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });

  const nextSequence = (lastOrder?.id ?? 0) + 1;
  return `ORD-${String(nextSequence).padStart(5, '0')}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const where: any = {};

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { porter: true }
  });

  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, categoryId, totalWeight, priority, porterId, zone } = body;
    const incomingCode = typeof code === 'string' ? code.trim() : '';

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const finalCode = incomingCode || (await generateNextOrderCode());

      try {
        const newOrder = await prisma.order.create({
          data: {
            code: finalCode,
            title,
            status: 'Pending',
            priority: priority || 'Media',
            zone: zone || null,
            totalWeight: parseFloat(totalWeight) || 0,
            categoryId: parseInt(categoryId),
            porterId: porterId ? parseInt(porterId) : null, // Guardamos la asignación aquí
          },
        });

        return NextResponse.json({ success: true, data: newOrder });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          if (incomingCode) {
            return NextResponse.json(
              {
                success: false,
                error: 'El codigo del pedido ya existe. Usa un codigo diferente.'
              },
              { status: 409 }
            );
          }

          continue;
        }

        throw error;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo generar un codigo unico para el pedido. Intenta nuevamente.'
      },
      { status: 409 }
    );
  } catch (error) {
    console.error("Error creando pedido:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'El codigo del pedido ya existe. Usa un codigo diferente.'
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: false, error: 'Error al crear pedido' }, { status: 500 });
  }
  
}