import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, sub, mul, div, add } from "@/lib/math";

// GET /api/admin/reports/monthly - Get monthly report for a specific salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const month = searchParams.get("month"); // Format: YYYY-MM
    const year = searchParams.get("year");

    if (!salon_id) {
      return NextResponse.json(
        { error: "salon_id is required" },
        { status: 400 }
      );
    }

    // Calculate date range
    let startDate: Date;
    let endDate: Date;

    if (month) {
      // Month format: YYYY-MM
      const [yearNum, monthNum] = month.split("-").map(Number);
      startDate = new Date(yearNum, monthNum - 1, 1);
      endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
    } else if (year) {
      // Year format: YYYY
      const yearNum = Number.parseInt(year);
      startDate = new Date(yearNum, 0, 1);
      endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);
    } else {
      // Current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get salon info
    const salon = await prisma.salon.findUnique({
      where: { salon_id },
      select: {
        salon_id: true,
        name: true,
        site: true,
        owner: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!salon) {
      return NextResponse.json(
        { error: "Salon not found" },
        { status: 404 }
      );
    }

    // Get total income from services
    const services = await prisma.serviceAction.findMany({
      where: {
        salon_id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        service_id: true,
        price_total: true,
        date: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalIncome = sum(services.map((service) => service.price_total));

    // Get total expenses
    const expenses = await prisma.expense.findMany({
      where: {
        salon_id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        exp_id: true,
        exp_type: true,
        exp_val: true,
        date: true,
      },
    });

    const totalExpenses = sum(expenses.map((expense) => expense.exp_val));

    // Get constants (recurring expenses like rent, utilities, etc.)
    const constants = await prisma.constants.findMany({
      where: {
        salon_id,
        status: "ACTIVE",
      },
      select: {
        const_id: true,
        const_name: true,
        const_value: true,
        repetation: true,
      },
    });

    // Calculate constants total based on repetition
    const constantsTotal = constants.reduce((acc, constant) => {
      if (month) {
        if (constant.repetation === "MONTHLY") return add(acc, constant.const_value);
        if (constant.repetation === "YEARLY")  return add(acc, div(constant.const_value, 12));
      } else if (year) {
        if (constant.repetation === "MONTHLY") return add(acc, mul(constant.const_value, 12));
        if (constant.repetation === "YEARLY")  return add(acc, constant.const_value);
      }
      return acc;
    }, 0);

    // Build a cat_id → rate map from the salon's CategoryRate table
    const categoryRates = await prisma.categoryRate.findMany({
      where: { salon_id },
      select: { cat_id: true, rate: true },
    });
    const categoryRateMap = new Map(categoryRates.map((cr) => [cr.cat_id, cr.rate]));

    // Get employee income breakdown (from subtasks)
    const employeeIncomes = await prisma.employee.findMany({
      where: {
        salon_id,
      },
      select: {
        emp_id: true,
        emp_name: true,
        emp_phone: true,
        tasks: {
          where: {
            service: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            task_id: true,
            sub_price: true,
            cat_id: true,
            service_id: true,
            service: {
              select: {
                price_total: true,
                date: true,
                client: {
                  select: {
                    name: true,
                    phone: true,
                  },
                },
              },
            },
            category: {
              select: {
                cat_name: true,
              },
            },
          },
        },
        withdrawals: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            withdraw_id: true,
            amount: true,
            date: true,
          },
        },
      },
    });

    // Calculate each employee's income
    // Build (service_id:cat_id) -> count map to split category rate among employees
    const taskCountMap = new Map<string, number>();
    for (const emp of employeeIncomes) {
      for (const task of emp.tasks) {
        const key = `${task.service_id}:${task.cat_id}`;
        taskCountMap.set(key, (taskCountMap.get(key) ?? 0) + 1);
      }
    }

    const employeeIncomeDetails = employeeIncomes.map((employee) => {
      const totalEarned    = sum(employee.tasks.map((task) => task.sub_price));
      const totalWithdrawn = sum(employee.withdrawals.map((withdrawal) => withdrawal.amount));
      const balance        = sub(totalEarned, totalWithdrawn);

      return {
        emp_id: employee.emp_id,
        emp_name: employee.emp_name,
        emp_phone: employee.emp_phone,
        total_earned: totalEarned,
        total_withdrawn: totalWithdrawn,
        balance,
        tasks_count: employee.tasks.length,
        tasks: employee.tasks.map((task) => ({
          task_id: task.task_id,
          amount: task.sub_price,
          service_price: task.service.price_total,
          percentage: Math.round(
            ((categoryRateMap.get(task.cat_id) ?? 0) /
              (taskCountMap.get(`${task.service_id}:${task.cat_id}`) ?? 1)) *
              100
          ),
          category: task.category.cat_name,
          client: task.service.client.name,
          client_phone: task.service.client.phone,
          date: task.service.date,
        })),
        withdrawals: employee.withdrawals,
      };
    });

    const totalEmployeeIncome = sum(employeeIncomeDetails.map((emp) => emp.total_earned));

    // Calculate net profit
    const netProfit = sub(sub(totalIncome, totalExpenses), constantsTotal);

    // eslint-disable-next-line unicorn/no-nested-ternary
    let periodType = "monthly";
    if (year && !month) periodType = "yearly";

    return NextResponse.json({
      salon,
      period: {
        start: startDate,
        end: endDate,
        type: periodType,
      },
      summary: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        constants_total: constantsTotal,
        employee_income_total: totalEmployeeIncome,
        net_profit: netProfit,
        services_count: services.length,
      },
      services,
      expenses,
      constants,
      employee_incomes: employeeIncomeDetails,
    });
  } catch (error) {
    console.error("Error fetching monthly report:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly report" },
      { status: 500 }
    );
  }
}
