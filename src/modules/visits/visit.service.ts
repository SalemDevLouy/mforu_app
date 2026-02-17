/* eslint-disable @typescript-eslint/no-explicit-any */
import * as repo from "./visit.repository";

// Business logic for Visits
export async function createVisit(input: { salonId: string; customerId: string; date?: string }) {
  // Validation and business rules live here (not in components)
  const { salonId, customerId, date } = input;
  if (!salonId) throw new Error("salonId is required");
  if (!customerId) throw new Error("customerId is required");

  const data: any = {
    salon: { connect: { id: salonId } },
    customer: { connect: { id: customerId } },
  };
  if (date) data.date = new Date(date);

  const visit = await repo.createVisitRecord(data);
  return visit;
}

export async function getVisit(id: string) {
  const v = await repo.findVisitById(id);
  if (!v) throw new Error("Visit not found");
  return v;
}
