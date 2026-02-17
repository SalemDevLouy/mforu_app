import { NextResponse } from "next/server";
import { addTaskToVisit } from "../../../modules/tasks/task.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { salonId, visitId, name, price, categoryId } = body;
    const task = await addTaskToVisit({ salonId, visitId, name, price, categoryId });
    return NextResponse.json(task);
  } catch (err) {
    console.error("POST /api/tasks error", err);
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(JSON.stringify({ error: message }), { status: 400 });
  }
}
