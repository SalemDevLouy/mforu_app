import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum } from "@/lib/math";

// GET /api/salon/clients/[client_id] - Get client details with debts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ client_id: string }> }
) {
  try {
    const { client_id } = await params;

    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        debts: {
          orderBy: {
            date_reg: "desc",
          },
        },
        services: {
          orderBy: {
            date: "desc",
          },
          take: 10,
          include: {
            tasks: {
              include: {
                category: true,
                employee: true,
              },
            },
          },
        },
        reservations: {
          orderBy: {
            date_exploit: "desc",
          },
          take: 5,
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    // Calculate debt statistics
    const totalDebt = sum(client.debts.map((debt) => debt.debt_val));
    const pendingDebt = sum(
      client.debts.filter((debt) => debt.status === "pending").map((debt) => debt.debt_val)
    );
    const paidDebt = sum(
      client.debts.filter((debt) => debt.status === "paid").map((debt) => debt.debt_val)
    );

    return NextResponse.json({
      success: true,
      client: {
        client_id: client.client_id,
        name: client.name,
        phone: client.phone,
        notes: client.notes,
      },
      debts: client.debts.map((debt) => ({
        debt_id: debt.debt_id,
        amount: debt.debt_val,
        date_reg: debt.date_reg,
        date_exp: debt.date_exp,
        status: debt.status,
      })),
      debtStats: {
        total: totalDebt,
        pending: pendingDebt,
        paid: paidDebt,
        count: client.debts.length,
      },
      services: client.services.map((service) => ({
        service_id: service.service_id,
        date: service.date,
        price_total: service.price_total,
        notes: service.notes,
        tasks: service.tasks.map((task) => ({
          task_id: task.task_id,
          category: task.category.cat_name,
          employee: task.employee.emp_name,
          price: task.sub_price,
        })),
      })),
      reservations: client.reservations.map((res) => ({
        reservation_id: res.reservation_id,
        date: res.date_exploit,
        status: res.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات العميل" },
      { status: 500 }
    );
  }
}
