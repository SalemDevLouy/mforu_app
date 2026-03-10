import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/salon/reservations - Get all reservations for a salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const status = searchParams.get("status");
    const client_id = searchParams.get("client_id");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!salon_id) {
      return NextResponse.json(
        { error: "معرف الصالون مطلوب" },
        { status: 400 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        salon_id,
        ...(status && { status }),
        ...(client_id && { client_id }),
        ...(startDate && endDate && {
          date_exploit: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date_exploit: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      reservations: reservations.map((res) => ({
        reservation_id: res.reservation_id,
        client_id: res.client_id,
        client_name: res.client.name,
        client_phone: res.client.phone,
        date_register: res.date_register,
        date_exploit: res.date_exploit,
        deposit: res.deposit,
        status: res.status,
      })),
      count: reservations.length,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات الحجوزات" },
      { status: 500 }
    );
  }
}

// POST /api/salon/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, client_id, date_exploit, deposit, status } = body;

    if (!salon_id || !client_id || !date_exploit) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
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

    const reservation = await prisma.reservation.create({
      data: {
        salon_id,
        client_id,
        date_exploit: new Date(date_exploit),
        deposit: deposit ? Number(deposit) : 0,
        status: status || "pending",
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

    return NextResponse.json({
      success: true,
      reservation: {
        reservation_id: reservation.reservation_id,
        client_id: reservation.client_id,
        client_name: reservation.client.name,
        client_phone: reservation.client.phone,
        date_register: reservation.date_register,
        date_exploit: reservation.date_exploit,
        deposit: reservation.deposit,
        status: reservation.status,
      },
      message: "تم إضافة الحجز بنجاح",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "فشل إضافة الحجز" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/reservations - Update a reservation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservation_id, date_exploit, deposit, status } = body;

    if (!reservation_id) {
      return NextResponse.json(
        { error: "معرف الحجز مطلوب" },
        { status: 400 }
      );
    }

    const existingReservation = await prisma.reservation.findUnique({
      where: { reservation_id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { reservation_id },
      data: {
        ...(date_exploit && { date_exploit: new Date(date_exploit) }),
        ...(deposit !== undefined && { deposit: Number(deposit) }),
        ...(status && { status }),
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

    return NextResponse.json({
      success: true,
      reservation: {
        reservation_id: updatedReservation.reservation_id,
        client_id: updatedReservation.client_id,
        client_name: updatedReservation.client.name,
        client_phone: updatedReservation.client.phone,
        date_register: updatedReservation.date_register,
        date_exploit: updatedReservation.date_exploit,
        deposit: updatedReservation.deposit,
        status: updatedReservation.status,
      },
      message: "تم تحديث الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "فشل تحديث الحجز" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/reservations?reservation_id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservation_id = searchParams.get("reservation_id");

    if (!reservation_id) {
      return NextResponse.json(
        { error: "معرف الحجز مطلوب" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { reservation_id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    await prisma.reservation.delete({
      where: { reservation_id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "فشل حذف الحجز" },
      { status: 500 }
    );
  }
}
