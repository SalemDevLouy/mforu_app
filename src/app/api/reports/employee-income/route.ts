/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { salonId, employeeId, startDate, endDate } = body;

    try {
  const where: Record<string, unknown> = { salonId };
      if (employeeId) where.employeeId = employeeId;
  const createdAtFilter: any = {};
  if (startDate) createdAtFilter.gte = new Date(startDate);
  if (endDate) createdAtFilter.lte = new Date(endDate);
  if (Object.keys(createdAtFilter).length) (where as any).createdAt = createdAtFilter;

  // TODO: EmployeeIncome model doesn't exist in schema yet
  // const incomes = await prisma.employeeIncome.findMany({ where: where as any });
  // const total = incomes.reduce((s: number, i: any) => s + Number(i.amount), 0);
  // return NextResponse.json({ total, incomes });
  
  return NextResponse.json({ 
    error: "EmployeeIncome model not implemented yet",
    total: 0, 
    incomes: [] 
  }, { status: 501 });
    } catch (error) {
      console.error("Error fetching employee income:", error);
      throw error;
    }
  } catch (err) {
    console.error("POST /api/reports/employee-income error", err);
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(JSON.stringify({ error: message }), { status: 400 });
  }
}
