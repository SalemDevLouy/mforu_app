/* eslint-disable @typescript-eslint/no-explicit-any */
// Repository: data access for SubTask related operations
import prisma from "@/lib/prisma";

export async function createSubTaskRecord(data: {
  service_id: string;
  emp_id: string;
  cat_id: string;
  sub_price: number;
}) {
  return prisma.subTask.create({ data });
}

export async function findSubTaskById(id: string) {
  return prisma.subTask.findUnique({ where: { task_id: id } });
}

export async function findServiceById(id: string) {
  return prisma.serviceAction.findUnique({ where: { service_id: id } });
}
