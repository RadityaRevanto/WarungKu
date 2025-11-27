// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/src/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession(req);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params di Next.js 15
    const { id } = await context.params;
    const body = await req.json();

    console.log("=== PATCH Request ===");
    console.log("ID:", id);
    console.log("Body:", body);
    console.log("User ID:", session.user.id);

    // Validasi data
    if (!body.name || body.price === undefined || body.stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cek apakah product exists dan milik user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    console.log("Existing product:", existingProduct);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    // Prepare data untuk update
    const updateData: any = {
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      minStock: body.minStock !== undefined ? Number(body.minStock) : 10,
    };

    // Handle barcode
    if (body.barcode !== undefined && body.barcode !== null && body.barcode !== "") {
      updateData.barcode = String(body.barcode);
    } else {
      updateData.barcode = null;
    }

    console.log("Update data:", updateData);

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    console.log("Product updated successfully:", updatedProduct);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("=== PATCH Error ===");
    console.error("Error:", error);
    
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession(req);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params di Next.js 15
    const { id } = await context.params;

    console.log("=== DELETE Request ===");
    console.log("ID:", id);
    console.log("User ID:", session.user.id);

    const result = await prisma.product.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    console.log("Delete result:", result);

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted", id });
  } catch (error) {
    console.error("=== DELETE Error ===");
    console.error("Error:", error);
    
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}