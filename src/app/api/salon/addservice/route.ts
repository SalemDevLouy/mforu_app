import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, sub, mul, div } from "@/lib/math";

// GET /api/salon/addservice?salon_id=...&date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const dateParam = searchParams.get("date"); // optional, YYYY-MM-DD

    if (!salon_id) {
      return NextResponse.json({ error: "salon_id مطلوب" }, { status: 400 });
    }

    const target = dateParam ? new Date(dateParam) : new Date();
    const dayStart = new Date(target);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(target);
    dayEnd.setHours(23, 59, 59, 999);

    const services = await prisma.serviceAction.findMany({
      where: {
        salon_id,
        date: { gte: dayStart, lte: dayEnd },
      },
      orderBy: { date: "desc" },
      include: {
        client: { select: { name: true, phone: true } },
        tasks: {
          include: {
            employee: { select: { emp_name: true } },
            category: { select: { cat_name: true } },
          },
        },
      },
    });

    const result = services.map((s) => {
      // Deduplicate category names and employee names across subtasks
      const categoryNames = [...new Set(s.tasks.map((t) => t.category.cat_name))];
      const employeeNames = [...new Set(s.tasks.map((t) => t.employee.emp_name))];

      return {
        service_id: s.service_id,
        client_name: s.client.name,
        client_phone: s.client.phone,
        categories: categoryNames,
        employees: employeeNames,
        price_total: s.price_total,
        date: s.date,
        notes: s.notes,
      };
    });

    const todayTotal = sum(result.map((s) => s.price_total));

    return NextResponse.json({ success: true, services: result, todayTotal });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الخدمات" }, { status: 500 });
  }
}

interface TaskInput {
  cat_id: string;
  price: number;
  employeeIds: string[];
}

// POST /api/salon/addservice
// Registers a new service session:
//  1. Finds existing client by phone/id or creates a new one
//  2. Creates a ServiceAction record
//  3. Creates SubTask rows (one per employee per task):
//     sub_price = (task.price × CategoryRate.rate) / employeeIds.length
//  4. Creates a Debt record if total > paidAmount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientPhone,   // optional
      clientId,      // optional — pre-filled when client was found by phone search
      salon_id,
      paidAmount,
      notes,
      tasks,
    }: {
      clientName: string;
      clientPhone?: string;
      clientId?: string;
      salon_id: string;
      paidAmount: number;
      notes?: string;
      tasks: TaskInput[];
    } = body;

    if (!salon_id) {
      return NextResponse.json({ error: "salon_id مطلوب" }, { status: 400 });
    }

    // --- Validation ---
    if (!clientName || clientName.trim() === "") {
      return NextResponse.json({ error: "اسم العميل مطلوب" }, { status: 400 });
    }
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "يجب إضافة خدمة واحدة على الأقل" }, { status: 400 });
    }
    if (paidAmount == null || paidAmount < 0) {
      return NextResponse.json({ error: "المبلغ المدفوع غير صالح" }, { status: 400 });
    }
    for (const task of tasks) {
      if (!task.cat_id) {
        return NextResponse.json({ error: "يجب اختيار نوع الخدمة لكل مهمة" }, { status: 400 });
      }
      if (!task.employeeIds || task.employeeIds.length === 0) {
        return NextResponse.json({ error: "يجب اختيار موظف واحد على الأقل لكل خدمة" }, { status: 400 });
      }
      if (!task.price || task.price <= 0) {
        return NextResponse.json({ error: "سعر الخدمة يجب أن يكون أكبر من صفر" }, { status: 400 });
      }
    }

    // --- Find or create client ---
    let client;

    if (clientId) {
      // Client was found via phone search on the front-end — verify it belongs to this salon
      client = await prisma.client.findFirst({
        where: { client_id: clientId, salon_id },
      });
    }

    if (!client && clientPhone && clientPhone.trim() !== "") {
      // Phone provided but no clientId — try to find by phone scoped to this salon
      client = await prisma.client.findFirst({
        where: { phone: clientPhone.trim(), salon_id },
      });
    }

    if (!client) {
      // Create a new client record linked to this salon
      client = await prisma.client.create({
        data: {
          name: clientName.trim(),
          phone: clientPhone?.trim() || null,
          notes: null,
          salon_id,
        },
      });
    }

    // --- Fetch category rates for this salon ---
    const catIds = [...new Set(tasks.map((t) => t.cat_id))];
    const categoryRates = await prisma.categoryRate.findMany({
      where: { salon_id, cat_id: { in: catIds } },
      select: { cat_id: true, rate: true },
    });
    const categoryRateMap = new Map(categoryRates.map((cr) => [cr.cat_id, cr.rate]));

    // --- Compute price total ---
    const priceTotal = sum(tasks.map((t) => t.price || 0));
    const remaining = sub(priceTotal, paidAmount);

    // --- Create ServiceAction + SubTasks + optional Debt in one transaction ---
    const result = await prisma.$transaction(async (tx) => {
      // 1. Service action
      const service = await tx.serviceAction.create({
        data: {
          salon_id,
          client_id: client!.client_id,
          price_total: priceTotal,
          date: new Date(),
          notes: notes?.trim() || null,
        },
      });

      // 2. Sub-tasks — one row per employee per task
      //    sub_price = (task.price × CategoryRate.rate) / employeeIds.length
      const subTaskData = tasks.flatMap((task) => {
        const rate = categoryRateMap.get(task.cat_id) ?? 1;  // default 1 = full price when no rate configured
        const employeePool = mul(task.price, rate);
        const perEmployee = div(employeePool, task.employeeIds.length);
        return task.employeeIds.map((emp_id) => ({
          service_id: service.service_id,
          emp_id,
          cat_id: task.cat_id,
          sub_price: perEmployee,
        }));
      });

      await tx.subTask.createMany({ data: subTaskData });

      // 3. Debt record: client underpaid → "pending", salon owes client (overpayment) → "credit"
      let debt = null;
      if (remaining > 0) {
        // Client paid less than total — client owes salon
        debt = await tx.debt.create({
          data: {
            client_id: client!.client_id,
            date_reg: new Date(),
            date_exp: null,
            status: "pending",
            debt_val: remaining,
          },
        });
      } else if (remaining < 0) {
        // Client paid more than total — salon owes client the change
        debt = await tx.debt.create({
          data: {
            client_id: client!.client_id,
            date_reg: new Date(),
            date_exp: null,
            status: "credit",
            debt_val: Math.abs(remaining),
          },
        });
      }

      return { service, subTaskCount: subTaskData.length, debt };
    });

    return NextResponse.json({
      success: true,
      service_id: result.service.service_id,
      client_id: client.client_id,
      client_name: client.name,
      price_total: priceTotal,
      paid_amount: paidAmount,
      remaining,
      debt_created: result.debt !== null && result.debt.status === "pending",
      credit_created: result.debt !== null && result.debt.status === "credit",
      debt_id: result.debt?.debt_id ?? null,
      sub_tasks_created: result.subTaskCount,
    });
  } catch (error) {
    console.error("Error registering service:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الخدمة" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/addservice — update notes and/or price_total of an existing service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { service_id, notes, price_total }: { service_id: string; notes?: string | null; price_total?: number } = body;

    if (!service_id) {
      return NextResponse.json({ error: "service_id مطلوب" }, { status: 400 });
    }

    const updated = await prisma.serviceAction.update({
      where: { service_id },
      data: {
        notes: notes === undefined ? undefined : (notes?.trim() || null),
        ...(price_total !== undefined && price_total > 0 ? { price_total } : {}),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الخدمة" }, { status: 500 });
  }
}

// DELETE /api/salon/addservice — delete a service and all its sub-tasks
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { service_id }: { service_id: string } = body;

    if (!service_id) {
      return NextResponse.json({ error: "service_id مطلوب" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.subTask.deleteMany({ where: { service_id } }),
      prisma.serviceAction.delete({ where: { service_id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حذف الخدمة" }, { status: 500 });
  }
}
