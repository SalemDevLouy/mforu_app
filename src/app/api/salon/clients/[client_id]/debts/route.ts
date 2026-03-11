import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, parseAmount } from "@/lib/math";

// GET /api/salon/clients/[client_id]/debts - Get client debts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ client_id: string }> }
) {
  try {
    const { client_id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const debts = await prisma.debt.findMany({
      where: {
        client_id,
        ...(status && { status }),
      },
      orderBy: {
        date_reg: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    const totalDebt = sum(debts.map((debt) => debt.debt_val));

    return NextResponse.json({
      success: true,
      debts: debts.map((debt) => ({
        debt_id: debt.debt_id,
        client_name: debt.client.name,
        client_phone: debt.client.phone,
        amount: debt.debt_val,
        date_reg: debt.date_reg,
        date_exp: debt.date_exp,
        status: debt.status,
      })),
      totalDebt,
      count: debts.length,
    });
  } catch (error) {
    console.error("Error fetching client debts:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات الديون" },
      { status: 500 }
    );
  }
}

// POST /api/salon/clients/[client_id]/debts - Add a new debt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ client_id: string }> }
) {
  try {
    const { client_id } = await params;
    const body = await request.json();
    const { debt_val, date_exp } = body;

    if (!debt_val || debt_val <= 0) {
      return NextResponse.json(
        { error: "قيمة الدين يجب أن تكون أكبر من صفر" },
        { status: 400 }
      );
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { client_id },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    const debt = await prisma.debt.create({
      data: {
        client_id,
        debt_val: parseAmount(debt_val),
        date_reg: new Date(),
        date_exp: date_exp ? new Date(date_exp) : null,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      debt: {
        debt_id: debt.debt_id,
        amount: debt.debt_val,
        date_reg: debt.date_reg,
        date_exp: debt.date_exp,
        status: debt.status,
      },
      message: "تم إضافة الدين بنجاح",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating debt:", error);
    return NextResponse.json(
      { error: "فشل إضافة الدين" },
      { status: 500 }
    );
  }
}
