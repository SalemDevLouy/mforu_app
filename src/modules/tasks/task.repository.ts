/* eslint-disable @typescript-eslint/no-explicit-any */
// Repository: data access for Task related operations
export async function createTaskRecord(data: unknown) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    const t = await prisma.task.create({ data: data as any });
    return t;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createTaskEmployeeRecords(records: Array<any>) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    const created = [];
    for (const r of records) {
      const c = await prisma.taskEmployee.create({ data: r });
      created.push(c);
    }
    return created;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createEmployeeIncomeRecords(records: Array<any>) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    const created = [];
    for (const r of records) {
      const c = await prisma.employeeIncome.create({ data: r });
      created.push(c);
    }
    return created;
  } finally {
    await prisma.$disconnect();
  }
}

export async function findTaskById(id: string) {
  const { PrismaClient } = await import("../../generated/prisma");
  const prisma = new PrismaClient();
  try {
    return await prisma.task.findUnique({ where: { id } });
  } finally {
    await prisma.$disconnect();
  }
}
