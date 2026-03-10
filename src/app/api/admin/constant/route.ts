import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/constant?salon_id=xxx&status=active
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const status   = searchParams.get("status");

    const constants = await prisma.constants.findMany({
      where: {
        ...(salon_id && { salon_id }),
        ...(status   && { status }),
      },
      select: {
        const_id:    true,
        const_name:  true,
        const_value: true,
        repetation:  true,
        status:      true,
        started_at:  true,
        salon: {
          select: { salon_id: true, name: true },
        },
      },
      orderBy: { started_at: "desc" },
    });

    return NextResponse.json({ success: true, constants });
  } catch (error) {
    console.error("GET /api/admin/constant error:", error);
    return NextResponse.json({ error: "فشل جلب الثوابت" }, { status: 500 });
  }
}

// POST /api/admin/constant
export async function POST(request: NextRequest) {
  try {
    const { const_name, const_value, repetation, status, salon_id, started_at } =
      await request.json();

    if (!const_name || !const_value || !repetation || !started_at) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
    }

    const constant = await prisma.constants.create({
      data: {
        const_name:  const_name.trim(),
        const_value: Number.parseFloat(const_value),
        repetation,
        status:      status || "active",
        salon_id:    salon_id || null,
        started_at:  new Date(started_at),
      },
    });

    return NextResponse.json({ success: true, constant, message: "تم إضافة الثابت بنجاح" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/constant error:", error);
    return NextResponse.json({ error: "فشل إضافة الثابت" }, { status: 500 });
  }
}

// PUT /api/admin/constant
export async function PUT(request: NextRequest) {
  try {
    const { const_id, const_name, const_value, repetation, status, salon_id, started_at } =
      await request.json();

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
        ...(const_name  && { const_name: const_name.trim() }),
        ...(const_value && { const_value: Number.parseFloat(const_value) }),
        ...(repetation  && { repetation }),
        ...(status !== undefined && { status }),
        ...(salon_id !== undefined && { salon_id: salon_id || null }),
        ...(started_at  && { started_at: new Date(started_at) }),
      },
    });

    return NextResponse.json({ success: true, constant: updated, message: "تم تحديث الثابت بنجاح" });
  } catch (error) {
    console.error("PUT /api/admin/constant error:", error);
    return NextResponse.json({ error: "فشل تحديث الثابت" }, { status: 500 });
  }
}

// DELETE /api/admin/constant?const_id=xxx
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
    console.error("DELETE /api/admin/constant error:", error);
    return NextResponse.json({ error: "فشل حذف الثابت" }, { status: 500 });
  }
}
