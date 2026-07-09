import { NextResponse } from 'next/server';
import { PackageRepository } from '@/lib/core/repositories/PackageRepository';

const repository = new PackageRepository();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pkg = await repository.getById(params.id);

    if (!pkg) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }

    const p: any = pkg;

    // Estructura JSON solicitada en el documento [cite: 56-67]
    const response = {
      trackingId: p.trackingId,
      sender: {
        name: p.sender?.name ?? null,
        contact: p.sender?.contact ?? null
      },
      destination: p.destination ?? null,
      status: p.status ?? null,
      weightKg: p.weightKg ?? null,
      shippingType: p.shippingType ?? null,
      estimatedDelivery: p.estimatedDelivery ?? null
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al consultar el paquete" }, { status: 500 });
  }
}