import { NextResponse } from 'next/server';
import { PackageRepository } from '@/lib/core/repositories/PackageRepository';
import { ExpressShipping } from '@/lib/core/strategies/ExpressShipping';
import { StandardShipping } from '@/lib/core/strategies/StandardShipping';

const repository = new PackageRepository();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Asignación de estrategia de costo [cite: 111]
    let costStrategy;
    if (data.shippingType === 'Express') {
      costStrategy = new ExpressShipping();
    } else {
      costStrategy = new StandardShipping();
    }

    const totalCost = costStrategy.calculateCost(data.weightKg);
    const trackingId = `PKG-${Math.floor(100000 + Math.random() * 900000)}`; // Generación Tracking ID [cite: 110]

    const newPackage = await repository.save({
      trackingId,
      destination: data.destination,
      weightKg: data.weightKg,
      status: 'Creado', // Estado inicial [cite: 109]
      shippingType: data.shippingType,
      totalCost,
      sender: {
        create: {
          name: data.sender.name,
          contact: data.sender.contact
        }
      }
    });

    return NextResponse.json(newPackage, { status: 201 }); // Código HTTP 201 [cite: 71]
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el paquete" }, { status: 500 });
  }
}