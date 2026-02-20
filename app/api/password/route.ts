import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const { current, new: newPassword } = await req.json();

    // Ambil password user
    const res = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [1] // ganti 1 dengan user id dinamis kalau mau
    );

    const user = res.rows[0];

    if (!user)
      return NextResponse.json({ success: false, error: "User tidak ditemukan" });

    const valid = bcrypt.compareSync(current, user.password);
    if (!valid)
      return NextResponse.json({ success: false, error: "Kata sandi saat ini salah" });

    const hashed = bcrypt.hashSync(newPassword, 10);

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, 1]);

    return NextResponse.json({ success: true, message: "Password berhasil diubah" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}