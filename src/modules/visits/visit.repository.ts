/* eslint-disable @typescript-eslint/no-explicit-any */
// Repository: data access for Visit related operations
export async function createVisitRecord(data: unknown) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    const v = await prisma.visit.create({ data: data as any });
    return v;
  } finally {
    await prisma.$disconnect();
  }
}

export async function findVisitById(id: string) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    return await prisma.visit.findUnique({ where: { id } });
  } finally {
    await prisma.$disconnect();
  }
}
