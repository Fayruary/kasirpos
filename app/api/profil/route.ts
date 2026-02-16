import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address } = body;

    // Ganti 1 dengan user ID dari session
    const [result] = await db.execute(
      "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address, 1]
    );

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
