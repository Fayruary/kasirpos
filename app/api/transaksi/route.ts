import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const {
      branch_id,
      shift_id,
      user_id,
      customer_id,
      discount_id,
      payment_method,
      paid_amount,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    await client.query("BEGIN");

    const invoiceCode = "INV-" + Date.now();

    // hitung subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    let discountAmount = 0;

    if (discount_id) {
      const discountRes = await client.query(
        `SELECT * FROM discounts WHERE id = $1 AND is_active = true`,
        [discount_id]
      );

      if (discountRes.rows.length > 0) {
        const discount = discountRes.rows[0];
        if (discount.type === "percent") {
          discountAmount = (subtotal * discount.value) / 100;
        } else {
          discountAmount = discount.value;
        }
      }
    }

    const totalAmount = subtotal - discountAmount;
    const changeAmount = paid_amount - totalAmount;

    if (changeAmount < 0) {
      throw new Error("Uang tidak cukup");
    }

    // INSERT SALES
    const saleRes = await client.query(
      `INSERT INTO sales 
      (branch_id, shift_id, invoice_code, customer_id, user_id,
       discount_id, subtotal, discount_amount, total_amount,
       paid_amount, change_amount, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [
        branch_id,
        shift_id,
        invoiceCode,
        customer_id,
        user_id,
        discount_id,
        subtotal,
        discountAmount,
        totalAmount,
        paid_amount,
        changeAmount,
        payment_method,
      ]
    );

    const saleId = saleRes.rows[0].id;

    // INSERT SALE ITEMS + UPDATE STOCK + STOCK LOG
    for (const item of items) {
      await client.query(
        `INSERT INTO sale_items 
        (sale_id, product_id, quantity, price, subtotal)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          saleId,
          item.product_id,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );

      await client.query(
        `UPDATE products 
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      await client.query(
        `INSERT INTO stock_logs
        (product_id, branch_id, type, quantity, reference_id)
        VALUES ($1,$2,'out',$3,$4)`,
        [
          item.product_id,
          branch_id,
          item.quantity,
          saleId,
        ]
      );
    }

    // UPDATE SHIFT
    await client.query(
      `UPDATE shifts
       SET total_sales = total_sales + $1,
           total_transactions = total_transactions + 1,
           total_cash = total_cash + CASE WHEN $2='cash' THEN $1 ELSE 0 END,
           total_qris = total_qris + CASE WHEN $2='qris' THEN $1 ELSE 0 END,
           total_transfer = total_transfer + CASE WHEN $2='transfer' THEN $1 ELSE 0 END
       WHERE id = $3`,
      [totalAmount, payment_method, shift_id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      invoice_code: invoiceCode,
      change: changeAmount,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}