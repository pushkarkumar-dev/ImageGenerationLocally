import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initDb } from "@/lib/initDb";

export async function DELETE(req, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      await query("DELETE FROM generated_images WHERE id = ?", [id]);
      return NextResponse.json({ message: "Permanently deleted." });
    }

    // Soft delete
    await query(
      "UPDATE generated_images SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    return NextResponse.json({ message: "Moved to trash." });
  } catch (error) {
    console.error("[gallery/images/[id] DELETE]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await initDb();
    const { id } = await params;
    const body = await req.json();

    if (body.action === "restore") {
      await query(
        "UPDATE generated_images SET deleted_at = NULL WHERE id = ?",
        [id]
      );
      return NextResponse.json({ message: "Restored." });
    }

    return NextResponse.json({ message: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("[gallery/images/[id] PATCH]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
