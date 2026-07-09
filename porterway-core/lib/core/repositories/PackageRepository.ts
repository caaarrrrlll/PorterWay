import prisma from '@/lib/prisma';
import { IPackageRepository } from './IPackageRepository';

export class PackageRepository implements IPackageRepository {
  async getById(id: string) {
    return await prisma.order.findUnique({
      where: { id: Number(id) }, // Quitar Number() si el id en Prisma es tipo String/UUID
      include: { 
        porter: true, 
        supervisor: true, 
        category: true 
      } 
    });
  }

  async save(pkg: any) {
    return await prisma.order.create({
      data: pkg
    });
  }

  async update(id: string, status: string) {
    return await prisma.order.update({
      where: { id: Number(id) }, // Quitar Number() si el id en Prisma es tipo String/UUID
      data: { status }
    });
  }
}