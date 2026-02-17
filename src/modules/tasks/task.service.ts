/* eslint-disable @typescript-eslint/no-explicit-any */
import * as repo from "./task.repository";
import { findVisitById } from "../visits/visit.repository";

export async function addTaskToVisit(input: {
  salonId: string;
  visitId: string;
  name: string;
  price: number;
  categoryId?: string;
}) {
  const { salonId, visitId, name, price, categoryId } = input;
  // Business rule: visit must belong to salon
  const visit = await findVisitById(visitId);
  if (!visit) throw new Error("Visit not found");
  if ((visit as any).salonId !== salonId) throw new Error("Visit does not belong to this salon");

  const data: any = {
    salon: { connect: { id: salonId } },
    visit: { connect: { id: visitId } },
    name,
    price,
  };
  if (categoryId) data.category = { connect: { id: categoryId } };

  const task = await repo.createTaskRecord(data);
  return task;
}

export async function assignEmployeesToTask(taskId: string, assignments: Array<{ employeeId: string; contributionPercent: number }>) {
  const task = await repo.findTaskById(taskId);
  if (!task) throw new Error("Task not found");

  const total = assignments.reduce((s, a) => s + a.contributionPercent, 0);
  if (Math.round(total) !== 100) throw new Error("Sum of contributionPercent must be 100");

  // Create TaskEmployee records
  const taskEmployeeRecords = assignments.map((a) => ({
    task: { connect: { id: taskId } },
    employee: { connect: { id: a.employeeId } },
    contributionPercent: a.contributionPercent,
  }));

  const createdLinks = await repo.createTaskEmployeeRecords(taskEmployeeRecords);

  // Create EmployeeIncome for each assignment
  const incomeRecords = assignments.map((a) => ({
    salon: { connect: { id: (task as any).salonId } },
    employee: { connect: { id: a.employeeId } },
    task: { connect: { id: taskId } },
    amount: ((task as any).price * a.contributionPercent) / 100,
  }));

  const incomes = await repo.createEmployeeIncomeRecords(incomeRecords);
  return { createdLinks, incomes };
}
