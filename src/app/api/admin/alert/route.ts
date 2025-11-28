import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/src/lib/prisma";
import {
  AlertResponse,
  StockStatus,
} from "@/src/app/(dashboard)/admin/alert/types";

const determineStatus = (stock: number, minStock: number): StockStatus => {
  if (stock <= 0) {
    return "outOfStock";
  }

  if (stock <= minStock) {
    return "lowStock";
  }

  return "safeStock";
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { userId: session.user.id },
      orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
    });

    const baseResponse: AlertResponse = {
      summary: {
        outOfStock: 0,
        lowStock: 0,
        safeStock: 0,
      },
      products: {
        outOfStock: [],
        lowStock: [],
        safeStock: [],
      },
      meta: {
        generatedAt: new Date().toISOString(),
        totalProducts: products.length,
      },
    };

    const payload = products.reduce<AlertResponse>((acc, product) => {
      const status = determineStatus(product.stock, product.minStock);

      acc.summary[status] += 1;
      acc.products[status].push({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        status,
      });

      return acc;
    }, baseResponse);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET Alert Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
