import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/reports/employee-income - Get employee income report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emp_id = searchParams.get("emp_id");
    const salon_id = searchParams.get("salon_id");
    const month = searchParams.get("month"); // Format: YYYY-MM

    if (!emp_id) {
      return NextResponse.json(
        { error: "emp_id is required" },
        { status: 400 }
      );
    }

    // Calculate date range
    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [yearNum, monthNum] = month.split("-").map(Number);
      startDate = new Date(yearNum, monthNum - 1, 1);
      endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
    } else {
      // Current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get employee details
    const employee = await prisma.employee.findUnique({
      where: { emp_id },
      select: {
        emp_id: true,
        emp_name: true,
        salon_id: true,
        salon: {
          select: {
            name: true,
            site: true,
          },
        },
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
            service: {
              select: {
                service_id: true,
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
          orderBy: {
            service: {
              date: "desc",
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
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if employee belongs to the specified salon (if provided)
    if (salon_id && employee.salon_id !== salon_id) {
      return NextResponse.json(
        { error: "Employee does not belong to this salon" },
        { status: 403 }
      );
    }

    // Calculate totals
    const totalEarned = employee.tasks.reduce((sum, task) => sum + task.sub_price, 0);
    const totalWithdrawn = employee.withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    const balance = totalEarned - totalWithdrawn;

    // Group tasks by category
    const tasksByCategory = employee.tasks.reduce((acc, task) => {
      const category = task.category.cat_name;
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          total: 0,
          tasks: [],
        };
      }
      acc[category].count++;
      acc[category].total += task.sub_price;
      acc[category].tasks.push({
        task_id: task.task_id,
        amount: task.sub_price,
        client: task.service.client.name,
        date: task.service.date,
      });
      return acc;
    }, {} as Record<string, { category: string; count: number; total: number; tasks: unknown[] }>);

    return NextResponse.json({
      employee: {
        emp_id: employee.emp_id,
        emp_name: employee.emp_name,
        salon: employee.salon,
      },
      period: {
        start: startDate,
        end: endDate,
        month,
      },
      summary: {
        total_earned: totalEarned,
        total_withdrawn: totalWithdrawn,
        balance,
        tasks_count: employee.tasks.length,
        withdrawals_count: employee.withdrawals.length,
      },
      tasks_by_category: Object.values(tasksByCategory),
      all_tasks: employee.tasks.map((task) => ({
        task_id: task.task_id,
        amount: task.sub_price,
        category: task.category.cat_name,
        client: task.service.client.name,
        client_phone: task.service.client.phone,
        date: task.service.date,
      })),
      withdrawals: employee.withdrawals,
    });
  } catch (error) {
    console.error("Error fetching employee income:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee income" },
      { status: 500 }
    );
  }
}
