import prisma from '@/lib/prisma';

export async function calculateTopPortersByCategoryAndZone(
  categoryId: number, 
  zone: string, 
  startDate?: string | null, 
  endDate?: string | null
) {
  // 1. Construimos el filtro dinámicamente
  const whereClause: any = {
    status: 'Completed',
    porterId: { not: null }
  };

  if (zone !== 'Todas') {
    whereClause.zone = zone;
  }

  if (categoryId !== 0) {
    whereClause.categoryId = categoryId;
  }

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate), // >= Fecha Inicio
      lte: new Date(endDate),   // <= Fecha Fin
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { porter: true }
  });

  const porterStats: Record<number, any> = {};

  orders.forEach(order => {
    if (!order.porterId) return;
    
    if (!porterStats[order.porterId]) {
      porterStats[order.porterId] = {
        porterId: order.porterId,
        firstName: order.porter!.firstName,
        lastName: order.porter!.lastName,
        totalOrders: 0,
        totalEfficiency: 0
      };
    }

    const stats = porterStats[order.porterId];
    stats.totalOrders += 1;

    let efficiency = 100;
    if (order.estimatedTime && order.actualTime && order.actualTime > 0) {
      efficiency = (order.estimatedTime / order.actualTime) * 100;
    }
    stats.totalEfficiency += efficiency;
  });

  const rankings = Object.values(porterStats).map(p => ({
    ...p,
    finalEfficiencyScore: parseFloat((p.totalEfficiency / p.totalOrders).toFixed(1))
  }));

  rankings.sort((a, b) => b.finalEfficiencyScore - a.finalEfficiencyScore);

  return rankings;
}