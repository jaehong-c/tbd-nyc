import { NextResponse } from "next/server";
import { workbookBuffer } from "@/lib/proforma/excel";

export const maxDuration = 30;

export async function POST(req) {
  let input;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!input || !input.scenario) return NextResponse.json({ error: "Missing pro forma inputs" }, { status: 400 });
  try {
    const buf = await workbookBuffer(input);
    const name = `tbd-nyc-proforma-${input.scenario}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    return new NextResponse(Buffer.from(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${name}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
