// app/api/reports/best-selling/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // db = pg Pool atau Supabase client

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        p.name,
        cat.name AS category,
        p.price,
        SUM(si.quantity) AS total_sold,
        SUM(si.quantity * si.price) AS revenue
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      JOIN categories cat ON p.category_id = cat.id
      GROUP BY p.id, p.name, cat.name, p.price
      ORDER BY total_sold DESC
    `);

    return NextResponse.json(result.rows);
  } catch (err: unknown) {
    console.error("Best-selling API Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}