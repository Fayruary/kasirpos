import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
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

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Database error", error },
      { status: 500 }
    );
  }
}
