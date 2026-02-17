import { NextResponse } from "next/server";
import { createVisit } from "../../../modules/visits/visit.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { salonId, customerId, date } = body;
    const visit = await createVisit({ salonId, customerId, date });
    return NextResponse.json(visit);
  } catch (err) {
    console.error("POST /api/visits error", err);
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(JSON.stringify({ error: message }), { status: 400 });
  }
}
