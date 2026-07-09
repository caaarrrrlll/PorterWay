import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/core/repositories/OrderRepository';

const repository = new OrderRepository();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const { porterId } = await request.json();

    const order = await repository.getById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (order.status !== 'Open') {
      return NextResponse.json(
        { error: `Transición inválida. La orden está en '${order.status}', debe ser 'Open' para asignación.` }, 
        { status: 409 }
      );
    }

    const updatedOrder = await repository.assignPorter(orderId, parseInt(porterId));
    return NextResponse.json(updatedOrder, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error al asignar transportista" }, { status: 500 });
  }
}