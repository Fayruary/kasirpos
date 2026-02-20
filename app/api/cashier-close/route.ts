// app/api/shifts/closed/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // db = pg Pool atau Supabase client

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        s.id,
        u.name AS cashier_name,
        s.starting_cash AS opening_balance,
        s.ending_cash AS closing_balance,
        s.total_sales,
        s.total_transactions,
        s.end_time AS created_at
      FROM shifts s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'closed'
      ORDER BY s.end_time DESC
    `);

    return NextResponse.json(result.rows); // <-- gunakan .rows, bukan destructure
  } catch (err: unknown) {
    console.error("Cashier Close API Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}