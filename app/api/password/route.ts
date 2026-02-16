import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const { current, new: newPassword } = await req.json();

    const [rows]: any = await db.execute("SELECT password FROM users WHERE id = ?", [1]);
    const user = rows[0];

    if (!user) return NextResponse.json({ success: false, error: "User tidak ditemukan" });

    const valid = bcrypt.compareSync(current, user.password);
    if (!valid) return NextResponse.json({ success: false, error: "Kata sandi saat ini salah" });

    const hashed = bcrypt.hashSync(newPassword, 10);

    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashed, 1]);

    return NextResponse.json({ success: true, message: "Password berhasil diubah" });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
