import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { deleteCategory, updateCategory } from "@/lib/db/content-management";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categoryId = Number(params.id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) return NextResponse.json({ error: "Invalid category id" }, { status: 400 });

    const body = (await request.json()) as { name?: string; description?: string };
    const name = (body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Category name is required" }, { status: 400 });

    const ok = await updateCategory(categoryId, name, body.description?.trim() || null);
    if (!ok) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categoryId = Number(params.id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) return NextResponse.json({ error: "Invalid category id" }, { status: 400 });

    const ok = await deleteCategory(categoryId);
    if (!ok) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
