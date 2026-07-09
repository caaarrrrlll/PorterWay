import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/core/repositories/OrderRepository';

const repository = new OrderRepository();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id);
    const { status: newStatus } = await request.json();
    const order = await repository.getById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Máquina de estados basada en tu esquema: Open -> In Progress -> Completed/Canceled
    const validTransitions: Record<string, string[]> = {
      'Open': ['In Progress', 'Canceled'],
      'In Progress': ['Completed', 'Canceled'],
      'Completed': [], // Estado final
      'Canceled': []   // Estado final
    };

    const allowedNextStatuses = validTransitions[order.status] || [];

    if (!allowedNextStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Transición inválida. No se puede pasar de '${order.status}' a '${newStatus}'` }, 
        { status: 409 }
      );
    }

    const updatedOrder = await repository.updateStatus(orderId, newStatus);
    return NextResponse.json(updatedOrder, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}