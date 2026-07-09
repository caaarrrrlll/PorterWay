import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import "dotenv/config";

const prismaClientSingleton = () => {
  // 1. Creamos la conexión directa (Pool) a Supabase
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Le pasamos el Pool al Adaptador oficial de Prisma 7
  const adapter = new PrismaPg(pool)
  
  // 3. Inicializamos PrismaClient *con* el adaptador (Lo que pedía el error)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma