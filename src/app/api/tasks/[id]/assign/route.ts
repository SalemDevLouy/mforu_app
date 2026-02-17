import { NextResponse } from "next/server";
import { assignEmployeesToTask } from "../../../../../modules/tasks/task.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { assignments } = body; // [{ employeeId, contributionPercent }]
    const result = await assignEmployeesToTask(id, assignments);
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/tasks/[id]/assign error", err);
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(JSON.stringify({ error: message }), { status: 400 });
  }
}
