"use client";

import {
  Card,
  CardDescriptionAlert,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { StockStatus } from "../types";

type AlertCardsProps = {
  summary?: Record<StockStatus, number>;
  isLoading: boolean;
};

const CARD_STYLES: Record<
  StockStatus,
  {
    title: string;
    footer: string;
    container: string;
    text: string;
  }
> = {
  outOfStock: {
    title: "Stok Habis",
    footer: "Produk perlu restock",
    container:
      "@container/card bg-pink-50 border border-red-300 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    text: "text-red-600",
  },
  lowStock: {
    title: "Stok Menipis",
    footer: "Produk segera habis",
    container:
      "@container/card bg-yellow-50 border border-yellow-300 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    text: "text-yellow-600",
  },
  safeStock: {
    title: "Stok Aman",
    footer: "Produk stok mencukupi",
    container:
      "@container/card bg-green-50 border border-green-300 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    text: "text-green-600",
  },
};

export function AlertCards({ summary, isLoading }: AlertCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 px-4 md:grid-cols-3 lg:px-6">
      {(Object.keys(CARD_STYLES) as Array<StockStatus>).map((status) => {
        const styles = CARD_STYLES[status];
        const value = summary?.[status] ?? 0;

        return (
          <Card key={status} className={styles.container}>
            <CardHeader className="pb-3">
              <CardDescriptionAlert
                className={`text-sm tracking-wide font-medium ${styles.text}`}
              >
                {styles.title}
              </CardDescriptionAlert>

              <CardTitle
                className={`@[250px]/card:text-3xl mt-3 text-3xl font-bold tabular-nums ${styles.text}`}
              >
                {isLoading ? "…" : value}
              </CardTitle>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1.5 text-sm pt-1">
              <div
                className={`line-clamp-1 flex gap-2 font-medium text-base ${styles.text}`}
              >
                {styles.footer}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
