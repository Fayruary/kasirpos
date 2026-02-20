import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    // Ambil password lama dari DB
    const result = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0]; // <-- pakai .rows, bukan destructure

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Cek password lama
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update ke DB
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    return NextResponse.json({ message: "Kata sandi berhasil diubah!" });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}