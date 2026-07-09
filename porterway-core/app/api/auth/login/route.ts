import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Faltan credenciales' }, { status: 400 });
    }

    // Buscamos al usuario en Supabase (incluyendo su Rol)
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { role: true }
    });

    // Validamos si existe y si la contraseña coincide 
    // (Nota: En producción aquí usaríamos bcrypt para comparar hashes)
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Si todo está bien, devolvemos los datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}