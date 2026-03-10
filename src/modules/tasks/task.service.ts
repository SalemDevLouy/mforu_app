/* eslint-disable @typescript-eslint/no-explicit-any */
import * as repo from "./task.repository";

export async function addTaskToVisit(input: {
  salonId: string;
  visitId: string;  // service_id in the actual schema
  name: string;     // not used directly, kept for API compatibility
  price: number;
  categoryId?: string;
}) {
  const { salonId, visitId, price, categoryId } = input;
  if (!categoryId) throw new Error("categoryId (cat_id) is required");

  // Verify the service exists and belongs to the salon
  const service = await repo.findServiceById(visitId);
  if (!service) throw new Error("Service not found");
  if (service.salon_id !== salonId) throw new Error("Service does not belong to this salon");

  throw new Error("emp_id is required to create a SubTask. Use the addservice route instead.");
}

export async function assignEmployeesToTask(taskId: string, assignments: Array<{ employeeId: string; contributionPercent: number }>) {
  const task = await repo.findSubTaskById(taskId);
  if (!task) throw new Error("SubTask not found");

  const total = assignments.reduce((s, a) => s + a.contributionPercent, 0);
  if (Math.round(total) !== 100) throw new Error("Sum of contributionPercent must be 100");

  // In the current schema, SubTask is already per-employee.
  // This endpoint returns a summary of the task's assignment.
  return { task, assignments };
}
