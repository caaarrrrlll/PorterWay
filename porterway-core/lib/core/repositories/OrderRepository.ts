import prisma from '@/lib/prisma';

export class OrderRepository {
  async getById(id: number) {
    return await prisma.order.findUnique({
      where: { id },
      include: { 
        porter: true, 
        supervisor: true,
        category: true,
        items: true
      } 
    });
  }

  async save(data: any) {
    return await prisma.order.create({
      data
    });
  }

  async updateStatus(id: number, status: string) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async assignPorter(id: number, porterId: number) {
    return await prisma.order.update({
      where: { id },
      data: { 
        porterId, 
        status: 'In Progress' // Transición automática al asignar
      }
    });
  }

  async getAll() {
    return await prisma.order.findMany({
      include: { 
        porter: true, 
        category: true 
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}