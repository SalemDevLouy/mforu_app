import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, sub, mul, div } from "@/lib/math";

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type DebtEntry = {
  debt_id: string;
  debt_val: number;
  date_reg: Date;
  status: string;
};

type ServiceRequestBody = {
  clientName: string;
  clientPhone?: string;
  clientId?: string;
  salon_id: string;
  paidAmount: number;
  discountAmount: number;
  notes?: string;
  tasks: TaskInput[];
};

type UpdateServiceRequestBody = {
  service_id: string;
  notes?: string | null;
  price_total?: number;
  tasks?: TaskInput[];
};

type ClientRecord = {
  client_id: string;
  name: string;
};

async function applyAmountToPendingDebts(
  tx: TransactionClient,
  pendingDebts: DebtEntry[],
  amount: number
) {
  let remaining = amount;
  let applied = 0;
  const sortedDebts = [...pendingDebts].sort((a, b) => a.date_reg.getTime() - b.date_reg.getTime());

  for (const debt of sortedDebts) {
    if (remaining <= 0) break;

    const used = Math.min(debt.debt_val, remaining);
    if (used >= debt.debt_val) {
      await tx.debt.update({
        where: { debt_id: debt.debt_id },
        data: { status: "paid" },
      });
    } else {
      await tx.debt.update({
        where: { debt_id: debt.debt_id },
        data: { debt_val: sub(debt.debt_val, used) },
      });
    }

    remaining = sub(remaining, used);
    applied += used;
  }

  return { applied, remaining };
}

async function consumeCreditBalances(
  tx: TransactionClient,
  creditDebts: DebtEntry[],
  amount: number
) {
  let remaining = amount;
  let consumed = 0;
  const sortedCredits = [...creditDebts].sort((a, b) => a.date_reg.getTime() - b.date_reg.getTime());

  for (const credit of sortedCredits) {
    if (remaining <= 0) break;

    const used = Math.min(credit.debt_val, remaining);
    if (used >= credit.debt_val) {
      await tx.debt.update({
        where: { debt_id: credit.debt_id },
        data: { status: "credit_returned" },
      });
    } else {
      await tx.debt.update({
        where: { debt_id: credit.debt_id },
        data: { debt_val: sub(credit.debt_val, used) },
      });
    }

    remaining = sub(remaining, used);
    consumed += used;
  }

  return { consumed, remaining };
}

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

    const catIds = [...new Set(services.flatMap((s) => s.tasks.map((t) => t.cat_id)))];
    const categoryRates = catIds.length > 0
      ? await prisma.categoryRate.findMany({
          where: { salon_id, cat_id: { in: catIds } },
          select: { cat_id: true, rate: true },
        })
      : [];
    const categoryRateMap = new Map(categoryRates.map((cr) => [cr.cat_id, cr.rate]));

    const result = services.map((s) => {
      const groupedByCategory = new Map<string, typeof s.tasks>();

      for (const task of s.tasks) {
        const group = groupedByCategory.get(task.cat_id) ?? [];
        group.push(task);
        groupedByCategory.set(task.cat_id, group);
      }

      const taskDetails = Array.from(groupedByCategory.entries()).map(([cat_id, subTasks]) => {
        const categoryName = subTasks[0]?.category.cat_name ?? "";
        const employeeIds = [...new Set(subTasks.map((task) => task.emp_id))];
        const employeeNames = [...new Set(subTasks.map((task) => task.employee.emp_name))];
        const subTotal = sum(subTasks.map((task) => task.sub_price));
        const rate = categoryRateMap.get(cat_id) ?? 1;
        const reconstructedPrice = rate > 0 ? div(subTotal, rate) : subTotal;

        return {
          cat_id,
          cat_name: categoryName,
          employeeIds,
          employeeNames,
          price: reconstructedPrice,
        };
      });

      const categoryNames = taskDetails.map((t) => t.cat_name);
      const employeeNames = [...new Set(taskDetails.flatMap((t) => t.employeeNames))];

      return {
        service_id: s.service_id,
        client_name: s.client.name,
        client_phone: s.client.phone,
        categories: categoryNames,
        employees: employeeNames,
        task_details: taskDetails,
        price_total: s.price_total,
        date: s.date,
        notes: s.notes,
      };
    });

    const todayTotal = sum(result.map((s) => s.price_total));

    // ── Fetch debts created on that date ──────────────────────────────────────
    const debts = await prisma.debt.findMany({
      where: {
        date_reg: { gte: dayStart, lte: dayEnd },
        client: { salon_id },
      },
    });

    const todayTotalDebt = sum(debts.filter((d) => d.status === "pending").map((d) => d.debt_val));
    const todayTotalCredit = sum(debts.filter((d) => d.status === "credit").map((d) => d.debt_val));

    return NextResponse.json({ success: true, services: result, todayTotal, todayTotalDebt, todayTotalCredit });
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

function validateServicePayload(payload: ServiceRequestBody) {
  if (!payload.salon_id) return "salon_id مطلوب";
  if (!payload.clientName || payload.clientName.trim() === "") return "اسم العميل مطلوب";
  if (!payload.tasks || payload.tasks.length === 0) return "يجب إضافة خدمة واحدة على الأقل";
  if (payload.paidAmount == null || payload.paidAmount < 0) return "المبلغ المدفوع غير صالح";
  if (payload.discountAmount == null || payload.discountAmount < 0) return "الخصم غير صالح";

  for (const task of payload.tasks) {
    if (!task.cat_id) return "يجب اختيار نوع الخدمة لكل مهمة";
    if (!task.employeeIds || task.employeeIds.length === 0) return "يجب اختيار موظف واحد على الأقل لكل خدمة";
    if (!task.price || task.price <= 0) return "سعر الخدمة يجب أن يكون أكبر من صفر";
  }

  return null;
}

function validateUpdateTasks(tasks?: TaskInput[]) {
  if (tasks === undefined) return null;
  if (!Array.isArray(tasks) || tasks.length === 0) return "يجب إضافة خدمة واحدة على الأقل";

  for (const task of tasks) {
    if (!task.cat_id) return "يجب اختيار نوع الخدمة لكل مهمة";
    if (!task.employeeIds || task.employeeIds.length === 0) return "يجب اختيار موظف واحد على الأقل لكل خدمة";
    if (!task.price || task.price <= 0) return "سعر الخدمة يجب أن يكون أكبر من صفر";
  }

  return null;
}

async function getServiceForUpdate(service_id: string) {
  return prisma.serviceAction.findUnique({
    where: { service_id },
    select: { service_id: true, salon_id: true },
  });
}

async function replaceServiceTasksAndPrice(
  serviceId: string,
  salonId: string,
  notes: string | null | undefined,
  tasks: TaskInput[]
) {
  const catIds = [...new Set(tasks.map((task) => task.cat_id))];
  const categoryRates = await prisma.categoryRate.findMany({
    where: { salon_id: salonId, cat_id: { in: catIds } },
    select: { cat_id: true, rate: true },
  });
  const categoryRateMap = new Map(categoryRates.map((cr) => [cr.cat_id, cr.rate]));
  const priceTotal = sum(tasks.map((task) => task.price));

  return prisma.$transaction(async (tx) => {
    const service = await tx.serviceAction.update({
      where: { service_id: serviceId },
      data: {
        notes: notes === undefined ? undefined : (notes?.trim() || null),
        price_total: priceTotal,
      },
    });

    await tx.subTask.deleteMany({ where: { service_id: serviceId } });
    const subTaskData = buildSubTaskData(serviceId, tasks, categoryRateMap);
    await tx.subTask.createMany({ data: subTaskData });

    return service;
  });
}

async function findOrCreateClient(payload: ServiceRequestBody): Promise<ClientRecord> {
  const trimmedPhone = payload.clientPhone?.trim();

  let client = payload.clientId
    ? await prisma.client.findFirst({ where: { client_id: payload.clientId, salon_id: payload.salon_id } })
    : null;

  if (!client && trimmedPhone) {
    client = await prisma.client.findFirst({
      where: { phone: trimmedPhone, salon_id: payload.salon_id },
    });
  }

  client ??= await prisma.client.create({
    data: {
      name: payload.clientName.trim(),
      phone: trimmedPhone || null,
      notes: null,
      salon_id: payload.salon_id,
    },
  });

  return { client_id: client.client_id, name: client.name };
}

function buildSubTaskData(
  serviceId: string,
  tasks: TaskInput[],
  categoryRateMap: Map<string, number>
) {
  return tasks.flatMap((task) => {
    const rate = categoryRateMap.get(task.cat_id) ?? 1;
    const employeePool = mul(task.price, rate);
    const perEmployee = div(employeePool, task.employeeIds.length);

    return task.employeeIds.map((emp_id) => ({
      service_id: serviceId,
      emp_id,
      cat_id: task.cat_id,
      sub_price: perEmployee,
    }));
  });
}

async function settleServiceBalance(
  tx: TransactionClient,
  clientId: string,
  serviceRemaining: number,
  paymentSurplus: number
) {
  const oldBalances = await reconcileOldBalances(tx, clientId);
  const refreshedDebts = await tx.debt.findMany({
    where: {
      client_id: clientId,
      status: { in: ["pending", "credit"] },
    },
    orderBy: { date_reg: "asc" },
  });

  const currentBalance = await resolveCurrentServiceBalance(
    tx,
    clientId,
    serviceRemaining,
    paymentSurplus,
    refreshedDebts
  );

  return {
    debt: currentBalance.debt,
    appliedExistingCreditToOldDebts: oldBalances.appliedExistingCreditToOldDebts,
    appliedExistingCreditToCurrentService: currentBalance.appliedExistingCreditToCurrentService,
    appliedSurplusToOldDebts: currentBalance.appliedSurplusToOldDebts,
    newPendingDebt: currentBalance.debt?.status === "pending" ? currentBalance.debt.debt_val : 0,
    newCreditBalance: currentBalance.debt?.status === "credit" ? currentBalance.debt.debt_val : 0,
  };
}

async function reconcileOldBalances(tx: TransactionClient, clientId: string) {
  let appliedExistingCreditToOldDebts = 0;

  const activeDebts = await tx.debt.findMany({
    where: {
      client_id: clientId,
      status: { in: ["pending", "credit"] },
    },
    orderBy: { date_reg: "asc" },
  });

  const oldPendingDebts = activeDebts.filter((entry) => entry.status === "pending" && entry.debt_val > 0);
  const oldCreditDebts = activeDebts.filter((entry) => entry.status === "credit" && entry.debt_val > 0);

  if (oldPendingDebts.length > 0 && oldCreditDebts.length > 0) {
    const reconcileOldBalances = Math.min(
      sum(oldPendingDebts.map((entry) => entry.debt_val)),
      sum(oldCreditDebts.map((entry) => entry.debt_val))
    );

    if (reconcileOldBalances > 0) {
      const pendingResult = await applyAmountToPendingDebts(tx, oldPendingDebts, reconcileOldBalances);
      const creditResult = await consumeCreditBalances(tx, oldCreditDebts, pendingResult.applied);
      appliedExistingCreditToOldDebts = creditResult.consumed;
    }
  }

  return { appliedExistingCreditToOldDebts };
}

async function resolveCurrentServiceBalance(
  tx: TransactionClient,
  clientId: string,
  serviceRemaining: number,
  paymentSurplus: number,
  refreshedDebts: DebtEntry[]
) {
  let appliedExistingCreditToCurrentService = 0;
  let appliedSurplusToOldDebts = 0;
  let debt = null;

  const remainingPendingDebts = refreshedDebts.filter((entry) => entry.status === "pending" && entry.debt_val > 0);
  const remainingCreditDebts = refreshedDebts.filter((entry) => entry.status === "credit" && entry.debt_val > 0);

  if (serviceRemaining > 0 && remainingCreditDebts.length > 0) {
    const creditResult = await consumeCreditBalances(tx, remainingCreditDebts, serviceRemaining);
    appliedExistingCreditToCurrentService = creditResult.consumed;
  }

  const netAfterExistingCredit = sub(serviceRemaining, appliedExistingCreditToCurrentService);

  if (netAfterExistingCredit > 0) {
    debt = await tx.debt.create({
      data: {
        client_id: clientId,
        date_reg: new Date(),
        date_exp: null,
        status: "pending",
        debt_val: netAfterExistingCredit,
      },
    });
  } else if (paymentSurplus > 0) {
    const surplus = paymentSurplus;

    if (remainingPendingDebts.length > 0) {
      const pendingResult = await applyAmountToPendingDebts(tx, remainingPendingDebts, surplus);
      appliedSurplusToOldDebts = pendingResult.applied;

      if (pendingResult.remaining > 0) {
        debt = await tx.debt.create({
          data: {
            client_id: clientId,
            date_reg: new Date(),
            date_exp: null,
            status: "credit",
            debt_val: pendingResult.remaining,
          },
        });
      }
    } else {
      debt = await tx.debt.create({
        data: {
          client_id: clientId,
          date_reg: new Date(),
          date_exp: null,
          status: "credit",
          debt_val: surplus,
        },
      });
    }
  }

  return { debt, appliedExistingCreditToCurrentService, appliedSurplusToOldDebts };
}

// POST /api/salon/addservice
// Registers a new service session:
//  1. Finds existing client by phone/id or creates a new one
//  2. Creates a ServiceAction record
//  3. Creates SubTask rows (one per employee per task):
//     sub_price = (task.price × CategoryRate.rate) / employeeIds.length
//  4. Creates a Debt record if discounted total > paidAmount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = body as ServiceRequestBody;
    const validationError = validateServicePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const client = await findOrCreateClient(payload);

    // --- Fetch category rates for this salon ---
    const catIds = [...new Set(payload.tasks.map((t) => t.cat_id))];
    const categoryRates = await prisma.categoryRate.findMany({
      where: { salon_id: payload.salon_id, cat_id: { in: catIds } },
      select: { cat_id: true, rate: true },
    });
    const categoryRateMap = new Map(categoryRates.map((cr) => [cr.cat_id, cr.rate]));

    // --- Compute price total ---
    const priceTotal = sum(payload.tasks.map((t) => t.price || 0));
    if (payload.discountAmount > priceTotal) {
      return NextResponse.json({ error: "الخصم لا يمكن أن يكون أكبر من الإجمالي" }, { status: 400 });
    }
    const discountedTotal = sub(priceTotal, payload.discountAmount);
    const serviceRemaining = sub(discountedTotal, payload.paidAmount);
    const paymentSurplus = Math.max(0, sub(payload.paidAmount, discountedTotal));

    // --- Create ServiceAction + SubTasks + optional Debt in one transaction ---
    const result = await prisma.$transaction(async (tx) => {
      const service = await tx.serviceAction.create({
        data: {
          salon_id: payload.salon_id,
          client_id: client.client_id,
          price_total: discountedTotal,
          date: new Date(),
          notes: payload.notes?.trim() || null,
        },
      });

      const subTaskData = buildSubTaskData(service.service_id, payload.tasks, categoryRateMap);

      await tx.subTask.createMany({ data: subTaskData });
      const settlement = await settleServiceBalance(
        tx,
        client.client_id,
        serviceRemaining,
        paymentSurplus
      );

      return {
        service,
        subTaskCount: subTaskData.length,
        ...settlement,
      };
    });

    return NextResponse.json({
      success: true,
      service_id: result.service.service_id,
      client_id: client.client_id,
      client_name: client.name,
      price_total: discountedTotal,
      original_total: priceTotal,
      discounted_total: discountedTotal,
      discount_amount: payload.discountAmount,
      paid_amount: payload.paidAmount,
      remaining: serviceRemaining,
      debt_created: result.debt !== null && result.debt.status === "pending",
      credit_created: result.debt !== null && result.debt.status === "credit",
      debt_id: result.debt?.debt_id ?? null,
      sub_tasks_created: result.subTaskCount,
      applied_existing_credit_to_old_debts: result.appliedExistingCreditToOldDebts,
      applied_existing_credit_to_current_service: result.appliedExistingCreditToCurrentService,
      applied_surplus_to_old_debts: result.appliedSurplusToOldDebts,
      new_pending_debt: result.newPendingDebt,
      new_credit_balance: result.newCreditBalance,
    });
  } catch (error) {
    console.error("Error registering service:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الخدمة" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/addservice — update notes/price and optionally replace tasks
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { service_id, notes, price_total, tasks }: UpdateServiceRequestBody = body;

    if (!service_id) {
      return NextResponse.json({ error: "service_id مطلوب" }, { status: 400 });
    }

    const taskValidationError = validateUpdateTasks(tasks);
    if (taskValidationError) {
      return NextResponse.json({ error: taskValidationError }, { status: 400 });
    }

    const existingService = await getServiceForUpdate(service_id);

    if (!existingService) {
      return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
    }

    if (tasks && tasks.length > 0) {
      const updated = await replaceServiceTasksAndPrice(
        service_id,
        existingService.salon_id,
        notes,
        tasks
      );

      return NextResponse.json({ success: true, service: updated });
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

    const service = await prisma.serviceAction.findUnique({
      where: { service_id },
      select: { service_id: true, client_id: true, date: true },
    });

    if (!service) {
      return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
    }

    // Debt/credit rows created during service registration are created around the same timestamp.
    const relatedWindowStart = new Date(service.date.getTime() - 5000);
    const relatedWindowEnd = new Date(service.date.getTime() + 5000);

    const result = await prisma.$transaction(async (tx) => {
      const deletedRelatedDebts = await tx.debt.deleteMany({
        where: {
          client_id: service.client_id,
          status: { in: ["pending", "credit"] },
          date_reg: { gte: relatedWindowStart, lte: relatedWindowEnd },
        },
      });

      await tx.subTask.deleteMany({ where: { service_id } });
      await tx.serviceAction.delete({ where: { service_id } });

      return { deleted_related_debts: deletedRelatedDebts.count };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حذف الخدمة" }, { status: 500 });
  }
}
