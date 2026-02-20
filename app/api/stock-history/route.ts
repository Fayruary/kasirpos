// app/api/stock-logs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT 
        sl.id,
        p.name AS product_name,
        sl.type,
        sl.quantity,
        sl.created_at,
        CASE 
          WHEN sl.type = 'in' THEN 'Pembelian'
          ELSE 'Penjualan'
        END AS note
      FROM stock_logs sl
      JOIN products p ON sl.product_id = p.id
      ORDER BY sl.created_at DESC
    `);

    return NextResponse.json(res.rows);
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Gagal ambil data", detail: message }, { status: 500 });
  }
}