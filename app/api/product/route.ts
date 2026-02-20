import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.barcode,
        p.price,
        p.stock,
        c.name AS category,
        p.created_at
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `);

    return NextResponse.json(res.rows);
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Database error", error: message },
      { status: 500 }
    );
  }
}