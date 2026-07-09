import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      vehicleType,
      zone,
      roleCode,
    } = body;

    if (!firstName || !lastName || !username || !email || !password || !vehicleType || !zone) {
      return NextResponse.json(
        { success: false, error: 'Completa todos los campos obligatorios.' },
        { status: 400 }
      );
    }

    const selectedRoleCode = typeof roleCode === 'string' && roleCode.trim() ? roleCode.trim() : 'PORTER';

    const role = await prisma.role.upsert({
      where: { code: selectedRoleCode },
      update: {},
      create: {
        code: selectedRoleCode,
        name: selectedRoleCode === 'SUPERVISOR' ? 'Supervisor' : 'Transportista',
      },
    });

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        vehicleType: vehicleType.trim(),
        zone: zone.trim(),
        roleId: role.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        vehicleType: true,
        zone: true,
        role: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error registrando usuario:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'El usuario o correo ya existen.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'No se pudo registrar el usuario.' },
      { status: 500 }
    );
  }

  
}
