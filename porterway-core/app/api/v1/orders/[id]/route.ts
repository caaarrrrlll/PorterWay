import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/core/repositories/OrderRepository';

const repository = new OrderRepository();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // AQUÍ SE RESUELVE LA PROMESA
    const orderId = parseInt(id);
    const order = await repository.getById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(`Error GET /orders/[id]:`, error);
    return NextResponse.json({ error: "Error al consultar la orden" }, { status: 500 });
  }
}