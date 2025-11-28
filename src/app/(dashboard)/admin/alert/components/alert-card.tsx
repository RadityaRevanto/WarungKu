"use client"

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
    container: "@container/card bg-pink-100 border-red-600",
    text: "text-red-600",
  },
  lowStock: {
    title: "Stok Menipis",
    footer: "Produk segera habis",
    container: "@container/card bg-yellow-100 border-yellow-600",
    text: "text-yellow-600",
  },
  safeStock: {
    title: "Stok Aman",
    footer: "Produk stok mencukupi",
    container: "@container/card bg-green-100 border-green-600",
    text: "text-green-600",
  },
};

export function AlertCards({ summary, isLoading }: AlertCardsProps) {
  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:px-6">
      {(
        Object.keys(CARD_STYLES) as Array<StockStatus>
      ).map((status) => {
        const styles = CARD_STYLES[status];
        const value = summary?.[status] ?? 0;

        return (
          <Card key={status} className={styles.container}>
            <CardHeader>
              <CardDescriptionAlert className={styles.text}>
                {styles.title}
              </CardDescriptionAlert>
              <CardTitle
                className={`@[250px]/card:text-3xl mt-4 text-2xl font-semibold tabular-nums ${styles.text}`}
              >
                {isLoading ? "…" : value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className={`line-clamp-1 flex gap-2 font-medium text-lg ${styles.text}`}>
                {styles.footer}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
