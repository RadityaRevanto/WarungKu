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
    wrapperClass:
      "@container/card border-red-300 bg-red-50 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    listClass: "mt-5 space-y-3",
    badgeClass: "bg-red-600 text-white border-red-600 shadow-sm",
    iconColor: "text-red-600",
    textColor: "text-red-600",
    Icon: TriangleAlert,
  },
  lowStock: {
    title: "Stok Menipis",
    description: "Produk berikut stoknya di bawah batas minimum",
    wrapperClass:
      "@container/card border-yellow-300 bg-yellow-50 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    listClass: "mt-5 space-y-3",
    badgeClass: "bg-orange-600 text-white border-orange-600 shadow-sm",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-600",
    Icon: TriangleAlert,
  },
  safeStock: {
    title: "Stok Aman",
    description: "Produk dengan stok mencukupi",
    wrapperClass:
      "@container/card border-green-300 bg-green-50 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all",
    listClass: "mt-5 grid grid-cols-1 gap-4 md:grid-cols-2",
    badgeClass: "bg-green-600 text-white border-green-600 shadow-sm",
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
      {(Object.entries(
        STATUS_CONFIG
      ) as Array<[StockStatus, (typeof STATUS_CONFIG)[StockStatus]]>).map(
        ([status, config]) => {
          const IconComponent = config.Icon;
          const items = products?.[status] ?? [];
          const isEmpty = !isLoading && items.length === 0;

          return (
            <div
              key={status}
              className="grid grid-cols-1 gap-4 px-4 lg:px-6"
            >
              <Card className={config.wrapperClass}>
                <CardHeader className="space-y-2 pb-5">
                  
                  {/* Header Title */}
                  <div className="flex items-center gap-2">
                    <IconComponent className={`${config.iconColor} size-7`} />
                    <CardDescriptionAlert
                      className={`${config.textColor} text-2xl font-semibold`}
                    >
                      {config.title}
                    </CardDescriptionAlert>
                  </div>

                  <CardDescriptionAlert className="text-slate-600 text-base">
                    {config.description}
                  </CardDescriptionAlert>

                  {/* List */}
                  <div className={config.listClass}>
                    
                    {/* Loading Skeleton */}
                    {isLoading && (
                      <Card className="border border-slate-200 bg-slate-50 rounded-xl shadow-sm">
                        <CardHeader className="space-y-3 py-3">
                          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                        </CardHeader>
                      </Card>
                    )}

                    {/* Empty State */}
                    {isEmpty && (
                      <Card className="border border-slate-200 bg-white rounded-xl shadow-sm">
                        <CardHeader>
                          <CardDescriptionAlert className="text-slate-500 text-sm">
                            Tidak ada data untuk kategori ini.
                          </CardDescriptionAlert>
                        </CardHeader>
                      </Card>
                    )}

                    {/* Product Items */}
                    {!isLoading &&
                      items.map((product) => (
                        <Card
                          key={product.id}
                          className={`border rounded-xl shadow-sm px-1 ${
                            status === "safeStock"
                              ? "border-green-300 bg-green-100"
                              : status === "lowStock"
                              ? "border-yellow-300 bg-yellow-100"
                              : "border-red-300 bg-pink-100"
                          }`}
                        >
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              
                              {/* Product Name */}
                              <div className="flex items-center gap-2">
                                {status === "safeStock" ? (
                                  <Box className="size-4 text-slate-700" />
                                ) : (
                                  <TriangleAlert className="size-4 text-slate-700" />
                                )}
                                <CardDescriptionAlert className="text-base font-medium">
                                  {product.name}
                                </CardDescriptionAlert>
                              </div>

                              {/* Badge */}
                              <Badge className={`${config.badgeClass} rounded-md px-2.5 py-1 text-xs`}>
                                {status === "safeStock"
                                  ? product.stock
                                  : `Stok: ${product.stock}${
                                      status === "lowStock"
                                        ? ` | Min: ${product.minStock}`
                                        : ""
                                    }`}
                              </Badge>
                            </div>

                            {/* Price */}
                            <CardDescriptionAlert
                              className={`${config.textColor} text-base font-semibold`}
                            >
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
