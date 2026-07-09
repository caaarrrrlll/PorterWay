import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtenemos los pedidos completados
    const orders = await prisma.order.findMany({
      where: { status: 'Completed', completedAt: { not: null } },
      orderBy: { completedAt: 'asc' },
      take: 7 // Últimos 7 pedidos para la muestra
    });

    // Procesamos para el gráfico: eficiencia = (estimado / real) * 100
    const analytics = orders.map((order: any) => ({ 
  date: order.completedAt ? new Date(order.completedAt).toLocaleDateString('es-EC', { weekday: 'short' }) : 'N/A',
  efficiency: (order.actualTime && order.estimatedTime) 
    ? parseFloat(((order.estimatedTime / order.actualTime) * 100).toFixed(1)) 
    : 0
}));

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener analytics' }, { status: 500 });
  }
}