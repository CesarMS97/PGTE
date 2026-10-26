
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Confirmación de autenticación pendiente de implementar" },
    { status: 501 }
  );
}
