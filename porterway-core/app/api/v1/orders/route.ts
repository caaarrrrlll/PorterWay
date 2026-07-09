import { NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/core/repositories/OrderRepository';
import { HighPriorityStrategy } from '@/lib/core/strategies/HighPriorityStrategy';
import { StandardPriorityStrategy } from '@/lib/core/strategies/StandardPriorityStrategy';

const repository = new OrderRepository();

// Endpoint para obtener todas las órdenes
export async function GET() {
  try {
    const orders = await repository.getAll();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error GET /orders:", error);
    return NextResponse.json({ error: "Error al obtener las órdenes" }, { status: 500 });
  }
}

// Endpoint para crear una nueva orden
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Asignación de estrategia de costo
    const costStrategy = data.priority === 'High' 
      ? new HighPriorityStrategy() 
      : new StandardPriorityStrategy();

    const calculatedCost = costStrategy.calculateCost(data.totalWeight || 0);
    const uniqueCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await repository.save({
      code: uniqueCode,
      title: data.title,
      description: data.description,
      status: 'Open',
      priority: data.priority,
      zone: data.zone,
      totalWeight: data.totalWeight,
      categoryId: data.categoryId
    });

    return NextResponse.json({ order: newOrder, calculatedCost }, { status: 201 });
  } catch (error) {
    console.error("Error POST /orders:", error);
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
  }
}