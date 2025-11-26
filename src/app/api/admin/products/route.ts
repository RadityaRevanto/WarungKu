import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export default async function GET() {
    const products = await prisma.product.findMany();

    if (!products) {
        return NextResponse.json("Products not found", { status: 404 });
    }

    return NextResponse.json(products);
}