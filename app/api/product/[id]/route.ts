import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }  // params sekarang Promise
) {
  const params = await context.params;  // <- unwrap Promise
  console.log("Params object:", params);
  console.log("Raw ID:", params.id);

  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "ID tidak ditemukan" }, { status: 400 });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const result = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [productId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Produk ${productId} berhasil dihapus`,
      deleted: result.rows[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Gagal menghapus produk", error: message }, { status: 500 });
  }
}