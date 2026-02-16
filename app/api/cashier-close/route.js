import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Fairuz07",
  database: "kasirpos_db",
};

export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
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

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("Cashier Close API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
