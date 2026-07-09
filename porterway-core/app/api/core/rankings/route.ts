import { NextResponse } from 'next/server';
import { calculateTopPortersByCategoryAndZone } from '@/lib/core/efficiencyCalculator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);    
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const zone = searchParams.get('zone') || 'Todas';
    const categoryId = parseInt(searchParams.get('categoryId') || '0');
    const topPorters = await calculateTopPortersByCategoryAndZone(
      categoryId, 
      zone, 
      startDate, 
      endDate
    );

    return NextResponse.json({ success: true, topPorters });
  } catch (error) {
    console.error("Error en API de rankings:", error);
    return NextResponse.json(
      { success: false, message: "Error al calcular rankings" }, 
      { status: 500 }
    );
  }
}