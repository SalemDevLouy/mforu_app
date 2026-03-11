import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum } from "@/lib/math";

// GET /api/salon/clients/search?phone=XXXXXXXXXX&salon_id=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const phone = searchParams.get("phone");

    if (!salon_id) {
      return NextResponse.json({ error: "salon_id مطلوب" }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json(
        { error: "رقم الهاتف مطلوب" },
        { status: 400 }
      );
    }

    // البحث عن العميل
    const client = await prisma.client.findFirst({
      where: {
        phone: phone,
        salon_id: salon_id,
      },
      include: {
        // جلب الديون النشطة (غير المدفوعة)
        debts: {
          where: {
            status: "pending", // أو "active" حسب نظامك
          },
          orderBy: {
            date_reg: "desc",
          },
        },
        // جلب الحجوزات النشطة
        reservations: {
          where: {
            status: {
              in: ["pending", "confirmed"], // الحجوزات المؤكدة أو قيد الانتظار
            },
          },
          orderBy: {
            date_exploit: "asc",
          },
        },
      },
    });

    if (!client) {
      // إذا لم يتم العثور على العميل، نعيد بيانات فارغة
      return NextResponse.json({
        found: false,
        client: null,
        totalDebt: 0,
        hasReservation: false,
        reservationAdvance: 0,
      });
    }

    // حساب إجمالي الديون
    const totalDebt = sum(client.debts.map((debt) => debt.debt_val));

    // التحقق من وجود حجز بمقدم (يمكن تخزين المقدم في notes أو إضافة حقل advance_payment)
    const hasReservation = client.reservations.length > 0;

    return NextResponse.json({
      found: true,
      client: {
        client_id: client.client_id,
        name: client.name,
        phone: client.phone,
        notes: client.notes,
      },
      totalDebt,
      debts: client.debts.map((debt) => ({
        debt_id: debt.debt_id,
        amount: debt.debt_val,
        date_reg: debt.date_reg,
        date_exp: debt.date_exp,
        status: debt.status,
      })),
      hasReservation,
      reservations: client.reservations.map((res) => ({
        reservation_id: res.reservation_id,
        date: res.date_exploit,
        deposit: res.deposit,
        status: res.status,
      })),
    });
  } catch (error) {
    console.error("Error searching for client:", error);
    return NextResponse.json(
      { error: "فشل البحث عن العميل" },
      { status: 500 }
    );
  }
}
