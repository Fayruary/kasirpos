import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET semua produk
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

// POST tambah produk
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      sku,
      category,
      price,
      stock,
      branch_id = 1, // default cabang 1
      cost = 0,      // default cost
    } = body;

    if (!name || !sku || !category) {
      return NextResponse.json(
        { message: "Name, SKU, and category are required" },
        { status: 400 }
      );
    }
    // Cek apakah SKU sudah ada
const skuCheck = await db.query(`SELECT id FROM products WHERE sku = $1`, [sku]);
if (skuCheck.rows.length > 0) {
  return NextResponse.json(
    { message: `SKU "${sku}" sudah ada, gunakan SKU lain.` },
    { status: 400 }
  );
}

    // Ambil category_id
    const catRes = await db.query(`SELECT id FROM categories WHERE name = $1`, [
      category,
    ]);
    let category_id: number;

    if (catRes.rows.length > 0) {
      category_id = catRes.rows[0].id;
    } else {
      // Buat kategori baru jika belum ada
      const newCat = await db.query(
        `INSERT INTO categories(name) VALUES($1) RETURNING id`,
        [category]
      );
      category_id = newCat.rows[0].id;
    }

    // Insert produk baru
    const productRes = await db.query(
      `INSERT INTO products(name, sku, price, cost, stock, category_id, branch_id)
       VALUES($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, sku, price, stock, created_at`,
      [name, sku, price, cost, stock, category_id, branch_id]
    );

    const newProduct = { ...productRes.rows[0], category };

    return NextResponse.json(newProduct);
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Database error", error: message },
      { status: 500 }
    );
  }
}