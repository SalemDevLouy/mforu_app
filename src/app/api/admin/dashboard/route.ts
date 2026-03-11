import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(

) {
  try {
  // return total number of salons
    const salonCount = await prisma.salon.count();
    const employeesCount = await prisma.employee.count();
    
    const salons = await prisma.salon.findMany({
      select: {
        salon_id: true,
        name: true,
        site: true,
        owner: {
          select: {
            name: true,
            phone: true,
            status: true,
          },
        },

      },
    });
    return NextResponse.json(
      {
        message: "Dashboard data fetched successfully",
        data: {
          salonCount,
          employeesCount,
          salons,
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { error: "Failed to fetch salon" },
      { status: 500 }
    );
  }
}

