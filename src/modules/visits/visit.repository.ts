/* eslint-disable @typescript-eslint/no-explicit-any */
// Repository: data access for ServiceAction (visit) related operations
import prisma from "@/lib/prisma";

export async function createVisitRecord(data: {
  salon_id: string;
  client_id: string;
  price_total: number;
  date: Date;
  notes?: string | null;
}) {
  return prisma.serviceAction.create({ data });
}

export async function findVisitById(id: string) {
  return prisma.serviceAction.findUnique({ where: { service_id: id } });
}
