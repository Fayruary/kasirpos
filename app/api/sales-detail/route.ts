import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT * FROM view_sales_detail ORDER BY created_at DESC LIMIT 10
  `);
  return new Response(JSON.stringify(rows), { status: 200 });
}
