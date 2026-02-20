// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const { name, email, phone, address } = await req.json();

    // Ganti 1 dengan user ID dinamis dari session Supabase nanti
    await db.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, address = $4 
       WHERE id = $5`,
      [name, email, phone, address, 1]
    );

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}