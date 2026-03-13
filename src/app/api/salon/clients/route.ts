import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum } from "@/lib/math";

// GET /api/salon/clients - Get all clients with their debt information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const salon_id = searchParams.get("salon_id");

    if (!salon_id) {
      return NextResponse.json(
        { error: "معرف الصالون مطلوب" },
        { status: 400 }
      );
    }

    const clients = await prisma.client.findMany({
      where: {
        salon_id,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        } : {}),
      },
      include: {
        debts: {
          where: {
            status: { in: ["pending", "credit"] },
          },
        },
        services: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Calculate total debt for each client
    const clientsWithDebts = clients.map((client) => {
      const pendingDebts = client.debts.filter((d) => d.status === "pending");
      const creditDebts  = client.debts.filter(
        (d) => d.status === "credit" || (d.status === "paid" && d.debt_val < 0)
      );

      const totalDebt   = sum(pendingDebts.map((d) => d.debt_val));
      const totalCredit = sum(creditDebts.map((d) => Math.abs(d.debt_val)));
      const lastVisit   = client.services[0]?.date || null;

      return {
        client_id:   client.client_id,
        name:        client.name,
        phone:       client.phone,
        notes:       client.notes,
        totalDebt,
        debtCount:   pendingDebts.length,
        totalCredit,
        creditCount: creditDebts.length,
        lastVisit,
      };
    });

    return NextResponse.json({
      success: true,
      clients: clientsWithDebts,
      count: clientsWithDebts.length,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات العملاء" },
      { status: 500 }
    );
  }
}

// POST /api/salon/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, notes, salon_id } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "اسم العميل مطلوب" },
        { status: 400 }
      );
    }

    if (!salon_id) {
      return NextResponse.json(
        { error: "معرف الصالون مطلوب" },
        { status: 400 }
      );
    }

    // Check if phone already exists in this salon
    if (phone) {
      const existingClient = await prisma.client.findFirst({
        where: { phone, salon_id },
      });

      if (existingClient) {
        return NextResponse.json(
          { error: "رقم الهاتف مسجل بالفعل في هذا الصالون" },
          { status: 400 }
        );
      }
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
        salon_id,
      },
    });

    return NextResponse.json({
      success: true,
      client: {
        client_id: client.client_id,
        name: client.name,
        phone: client.phone,
        notes: client.notes,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "فشل إضافة العميل" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/clients - Update a client
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, name, phone, notes } = body;

    if (!client_id) {
      return NextResponse.json(
        { error: "معرف العميل مطلوب" },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "اسم العميل مطلوب" },
        { status: 400 }
      );
    }

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { client_id },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    // Check if phone is being changed and if new phone already exists in this salon
    if (phone && phone !== existingClient.phone) {
      const phoneExists = await prisma.client.findFirst({
        where: {
          phone,
          salon_id: existingClient.salon_id,
          client_id: { not: client_id },
        },
      });

      if (phoneExists) {
        return NextResponse.json(
          { error: "رقم الهاتف مسجل بالفعل لعميل آخر" },
          { status: 400 }
        );
      }
    }

    const updatedClient = await prisma.client.update({
      where: { client_id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      client: {
        client_id: updatedClient.client_id,
        name: updatedClient.name,
        phone: updatedClient.phone,
        notes: updatedClient.notes,
      },
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "فشل تحديث بيانات العميل" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/clients?client_id=xxx - Delete a client
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const client_id = searchParams.get("client_id");

    if (!client_id) {
      return NextResponse.json(
        { error: "معرف العميل مطلوب" },
        { status: 400 }
      );
    }

    // Check if client has any services or debts
    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        services: true,
        debts: true,
        reservations: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    if (client.services.length > 0 || client.debts.length > 0 || client.reservations.length > 0) {
      return NextResponse.json(
        { error: "لا يمكن حذف العميل لوجود سجلات مرتبطة به (خدمات، ديون، أو حجوزات)" },
        { status: 400 }
      );
    }

    await prisma.client.delete({
      where: { client_id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف العميل بنجاح",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "فشل حذف العميل" },
      { status: 500 }
    );
  }
}
