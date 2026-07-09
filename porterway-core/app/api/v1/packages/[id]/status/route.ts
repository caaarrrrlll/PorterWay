import { NextResponse } from 'next/server';
import { PackageRepository } from '@/lib/core/repositories/PackageRepository';

const repository = new PackageRepository();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status: newStatus } = await request.json();
    const pkg = await repository.getById(params.id);

    if (!pkg) {
      return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 });
    }

    // Validación de estado inconsistente [cite: 72]
    const invalidTransitions: Record<string, string[]> = {
      'Entregado': ['EnTransito', 'Cancelado', 'Devuelto'], 
      'Devuelto': ['EnTransito', 'Entregado'],
      'Cancelado': ['EnTransito', 'Entregado', 'Devuelto']
    };

    if (invalidTransitions[pkg.status]?.includes(newStatus)) {
      return NextResponse.json(
        { error: `Regla de negocio violada: No se puede pasar de '${pkg.status}' a '${newStatus}'` }, 
        { status: 409 } // HTTP 409 Conflict [cite: 74]
      );
    }

    const updatedPackage = await repository.update(params.id, newStatus);
    return NextResponse.json(updatedPackage, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}