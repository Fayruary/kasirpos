import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT * FROM view_best_selling LIMIT 5
  `);
  return new Response(JSON.stringify(rows), { status: 200 });
}
