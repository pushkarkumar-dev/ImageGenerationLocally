import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initDb } from "@/lib/initDb";

export async function GET(req) {
  try {
    await initDb();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const offset = (page - 1) * limit;

    const rows = await query(
      "SELECT id, prompt, image_url, resolution, created_at, deleted_at FROM generated_images WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [{ total }] = await query(
      "SELECT COUNT(*) AS total FROM generated_images WHERE deleted_at IS NOT NULL"
    );

    return NextResponse.json({ items: rows, total, page, limit });
  } catch (error) {
    console.error("[trash/images GET]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
