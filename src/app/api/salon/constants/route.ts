import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, parseAmount } from "@/lib/math";

// GET /api/salon/constants?salon_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const status = searchParams.get("status");

    if (!salon_id) {
      return NextResponse.json({ error: "معرف الصالون مطلوب" }, { status: 400 });
    }

    const constants = await prisma.constants.findMany({
      where: {
        salon_id,
        ...(status && { status }),
      },
      orderBy: { started_at: "desc" },
    });

    const totalMonthly = sum(
      constants
        .filter((c) => c.status === "active" && c.repetation === "monthly")
        .map((c) => c.const_value)
    );

    return NextResponse.json({
      success: true,
      constants: constants.map((c) => ({
        const_id: c.const_id,
        const_name: c.const_name,
        const_value: c.const_value,
        repetation: c.repetation,
        status: c.status,
        started_at: c.started_at,
      })),
      summary: {
        count: constants.length,
        totalMonthly,
      },
    });
  } catch (error) {
    console.error("Error fetching constants:", error);
    return NextResponse.json({ error: "فشل جلب الثوابت" }, { status: 500 });
  }
}

// POST /api/salon/constants
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, const_name, const_value, repetation, status, started_at } = body;

    if (!salon_id || !const_name || !const_value || !repetation || !started_at) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
    }

    if (Number(const_value) <= 0) {
      return NextResponse.json({ error: "القيمة يجب أن تكون أكبر من صفر" }, { status: 400 });
    }

    const constant = await prisma.constants.create({
      data: {
        salon_id,
        const_name: const_name.trim(),
        const_value: parseAmount(const_value),
        repetation,
        status: status || "active",
        started_at: new Date(started_at),
      },
    });

    return NextResponse.json(
      { success: true, constant, message: "تم إضافة الثابت بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating constant:", error);
    return NextResponse.json({ error: "فشل إضافة الثابت" }, { status: 500 });
  }
}

// PUT /api/salon/constants
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { const_id, const_name, const_value, repetation, status, started_at } = body;

    if (!const_id) {
      return NextResponse.json({ error: "معرف الثابت مطلوب" }, { status: 400 });
    }

    const existing = await prisma.constants.findUnique({ where: { const_id } });
    if (!existing) {
      return NextResponse.json({ error: "الثابت غير موجود" }, { status: 404 });
    }

    const updated = await prisma.constants.update({
      where: { const_id },
      data: {
        ...(const_name && { const_name: const_name.trim() }),
        ...(const_value && { const_value: parseAmount(const_value) }),
        ...(repetation && { repetation }),
        ...(status !== undefined && { status }),
        ...(started_at && { started_at: new Date(started_at) }),
      },
    });

    return NextResponse.json({ success: true, constant: updated, message: "تم تحديث الثابت بنجاح" });
  } catch (error) {
    console.error("Error updating constant:", error);
    return NextResponse.json({ error: "فشل تحديث الثابت" }, { status: 500 });
  }
}

// DELETE /api/salon/constants?const_id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const const_id = searchParams.get("const_id");

    if (!const_id) {
      return NextResponse.json({ error: "معرف الثابت مطلوب" }, { status: 400 });
    }

    const existing = await prisma.constants.findUnique({ where: { const_id } });
    if (!existing) {
      return NextResponse.json({ error: "الثابت غير موجود" }, { status: 404 });
    }

    await prisma.constants.delete({ where: { const_id } });

    return NextResponse.json({ success: true, message: "تم حذف الثابت بنجاح" });
  } catch (error) {
    console.error("Error deleting constant:", error);
    return NextResponse.json({ error: "فشل حذف الثابت" }, { status: 500 });
  }
}
