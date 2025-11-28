"use client";

import {
  Card,
  CardDescriptionAlert,
  CardHeader,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { TriangleAlert, CheckCircle, Box } from "lucide-react";
import { AlertProduct, StockStatus } from "../types";

type CardDataProps = {
  products?: Record<StockStatus, AlertProduct[]>;
  isLoading: boolean;
};

const STATUS_CONFIG: Record<
  StockStatus,
  {
    title: string;
    description: string;
    wrapperClass: string;
    listClass: string;
    badgeClass: string;
    iconColor: string;
    textColor: string;
    Icon: typeof TriangleAlert;
  }
> = {
  outOfStock: {
    title: "Stok Habis",
    description: "Produk berikut sudah habis dan tidak bisa dijual",
    wrapperClass: "@container/card border-red-400 bg-red-50",
    listClass: "mt-4 space-y-2",
    badgeClass: "bg-red-600 text-white border-red-600",
    iconColor: "text-red-600",
    textColor: "text-red-600",
    Icon: TriangleAlert,
  },
  lowStock: {
    title: "Stok Menipis",
    description: "Produk berikut stoknya di bawah batas minimum",
    wrapperClass: "@container/card border-yellow-400 bg-yellow-50",
    listClass: "mt-4 space-y-2",
    badgeClass: "bg-orange-600 text-white border-orange-600",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-600",
    Icon: TriangleAlert,
  },
  safeStock: {
    title: "Stok Aman",
    description: "Produk dengan stok mencukupi",
    wrapperClass: "@container/card border-green-400 bg-green-50",
    listClass: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2",
    badgeClass: "bg-green-600 text-white border-green-600",
    iconColor: "text-green-600",
    textColor: "text-green-600",
    Icon: CheckCircle,
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function CardData({ products, isLoading }: CardDataProps) {
  return (
    <div className="flex flex-col gap-10">
      {(Object.entries(STATUS_CONFIG) as Array<[StockStatus, (typeof STATUS_CONFIG)[StockStatus]]>).map(
        ([status, config]) => {
          const IconComponent = status === "safeStock" ? config.Icon : config.Icon;
          const items = products?.[status] ?? [];
          const isEmpty = !isLoading && items.length === 0;

          return (
            <div
              key={status}
              className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6"
            >
              <Card className={config.wrapperClass}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`${config.iconColor} size-8`} />
                    <CardDescriptionAlert className={`${config.textColor} text-3xl`}>
                      {config.title}
                    </CardDescriptionAlert>
                  </div>
                  <CardDescriptionAlert className="text-slate-500">
                    {config.description}
                  </CardDescriptionAlert>
                  <div className={config.listClass}>
                    {isLoading && (
                      <Card className="@container/card border-dashed border-slate-200 bg-slate-50">
                        <CardHeader>
                          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                        </CardHeader>
                      </Card>
                    )}
                    {isEmpty && (
                      <Card className="@container/card border-slate-200 bg-white">
                        <CardHeader>
                          <CardDescriptionAlert className="text-slate-500">
                            Tidak ada data untuk kategori ini.
                          </CardDescriptionAlert>
                        </CardHeader>
                      </Card>
                    )}
                    {!isLoading &&
                      items.map((product) => (
                        <Card
                          key={product.id}
                          className={`@container/card border ${status === "safeStock" ? "border-green-400 bg-green-100" : status === "lowStock" ? "border-yellow-400 bg-yellow-100" : "border-red-400 bg-pink-100"}`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {status === "safeStock" ? (
                                  <Box className="size-5 text-slate-700" />
                                ) : (
                                  <TriangleAlert className="size-5 text-slate-700" />
                                )}
                                <CardDescriptionAlert className="text-black-600 text-xl">
                                  {product.name}
                                </CardDescriptionAlert>
                              </div>
                              <Badge
                                className={`${config.badgeClass} rounded-sm px-3 py-2`}
                              >
                                {status === "safeStock"
                                  ? product.stock
                                  : `Stok: ${product.stock}${
                                      status === "lowStock" ? ` | Min: ${product.minStock}` : ""
                                    }`}
                              </Badge>
                            </div>
                            <CardDescriptionAlert className={`${config.textColor} text-xl font-normal`}>
                              {formatCurrency(product.price)}
                            </CardDescriptionAlert>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </CardHeader>
              </Card>
            </div>
          );
        }
      )}
    </div>
  );
}
