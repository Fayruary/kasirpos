// app/api/sales/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT 
        s.id,
        s.invoice_code,
        u.name AS cashier,
        c.name AS customer,
        s.total_amount,
        s.created_at,
        COALESCE(SUM(si.quantity),0) AS total_items
      FROM sales s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN sale_items si ON si.sale_id = s.id
      GROUP BY s.id, u.name, c.name, s.total_amount, s.created_at
      ORDER BY s.created_at DESC;
    `);

    return NextResponse.json(res.rows);
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Gagal ambil data", detail: message }, { status: 500 });
  }
}