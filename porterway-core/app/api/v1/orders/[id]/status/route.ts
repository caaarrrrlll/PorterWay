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
    const { status } = await request.json();

    const order = await repository.getById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const validTransitions: Record<string, string[]> = {
      'Open': ['In Progress', 'Canceled'],
      'In Progress': ['Completed', 'Canceled'],
      'Completed': [], 
      'Canceled': []   
    };

    const allowedNextStatuses = validTransitions[order.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Transición inválida. No se puede pasar de '${order.status}' a '${status}'` }, 
        { status: 409 }
      );
    }

    const updatedOrder = await repository.updateStatus(orderId, status);
    return NextResponse.json(updatedOrder, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}