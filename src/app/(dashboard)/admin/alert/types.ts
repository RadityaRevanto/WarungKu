export type StockStatus = "outOfStock" | "lowStock" | "safeStock";

export type AlertProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  status: StockStatus;
};

export type AlertResponse = {
  summary: Record<StockStatus, number>;
  products: Record<StockStatus, AlertProduct[]>;
  meta: {
    generatedAt: string;
    totalProducts: number;
  };
};


