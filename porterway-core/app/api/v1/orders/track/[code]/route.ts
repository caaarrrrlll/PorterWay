import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/core/repositories/OrderRepository';

const repository = new OrderRepository();

export async function GET(request: Request, { params }: { params: { code: string } }) {
  try {
    const order = await repository.getByCode(params.code);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(`Error GET /orders/track/${params.code}:`, error);
    return NextResponse.json({ error: "Error al consultar la trazabilidad" }, { status: 500 });
  }
}