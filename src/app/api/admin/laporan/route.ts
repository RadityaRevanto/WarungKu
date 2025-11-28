import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/src/lib/prisma";

type SummaryResponse = {
  omzetToday: number;
  transactionsToday: number;
  itemsSoldToday: number;
};

type ChartPoint = {
  date: string;
  totalAmount: number;
  transactions: number;
  itemsSold: number;
};

type TopProduct = {
  id: string;
  name: string;
  price: number;
  quantitySold: number;
  revenue: number;
};

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const chartRangeDays = Math.max(
      7,
      Math.min(180, Number(url.searchParams.get("chartRange")) || 90)
    );
    const topRangeDays = Math.max(
      7,
      Math.min(90, Number(url.searchParams.get("topRange")) || 30)
    );

    const todayStart = startOfDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);
    const chartRangeStart = addDays(todayStart, -(chartRangeDays - 1));
    const topRangeStart = addDays(todayStart, -(topRangeDays - 1));

    const [todaySales, chartSales, topSaleItems] = await Promise.all([
      prisma.sale.findMany({
        where: {
          userId: session.user.id,
          saleDate: {
            gte: todayStart,
            lt: tomorrowStart,
          },
        },
        include: { items: true },
      }),
      prisma.sale.findMany({
        where: {
          userId: session.user.id,
          saleDate: {
            gte: chartRangeStart,
            lt: tomorrowStart,
          },
        },
        include: { items: true },
        orderBy: { saleDate: "asc" },
      }),
      prisma.saleItem.findMany({
        where: {
          sale: {
            userId: session.user.id,
            saleDate: {
              gte: topRangeStart,
              lt: tomorrowStart,
            },
          },
        },
        include: { product: true },
      }),
    ]);

    const summary = todaySales.reduce<SummaryResponse>(
      (acc, sale) => {
        acc.omzetToday += sale.totalAmount;
        acc.transactionsToday += 1;
        acc.itemsSoldToday += sale.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return acc;
      },
      { omzetToday: 0, transactionsToday: 0, itemsSoldToday: 0 }
    );

    const chartMap = new Map<string, ChartPoint>();

    chartSales.forEach((sale) => {
      const dateKey = sale.saleDate.toISOString().split("T")[0];
      if (!chartMap.has(dateKey)) {
        chartMap.set(dateKey, {
          date: dateKey,
          totalAmount: 0,
          transactions: 0,
          itemsSold: 0,
        });
      }

      const entry = chartMap.get(dateKey)!;
      entry.totalAmount += sale.totalAmount;
      entry.transactions += 1;
      entry.itemsSold += sale.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    });

    const chart = Array.from(chartMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const topProductMap = new Map<string, TopProduct>();

    topSaleItems.forEach((saleItem) => {
      if (!saleItem.product) {
        return;
      }

      const existing =
        topProductMap.get(saleItem.productId) ||
        {
          id: saleItem.product.id,
          name: saleItem.product.name,
          price: saleItem.product.price,
          quantitySold: 0,
          revenue: 0,
        };

      existing.quantitySold += saleItem.quantity;
      existing.revenue += saleItem.totalPrice;

      topProductMap.set(saleItem.productId, existing);
    });

    const topProducts = Array.from(topProductMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    return NextResponse.json({
      summary,
      chart,
      topProducts,
      meta: {
        chartRangeDays,
        topRangeDays,
      },
    });
  } catch (error) {
    console.error("GET Laporan Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

