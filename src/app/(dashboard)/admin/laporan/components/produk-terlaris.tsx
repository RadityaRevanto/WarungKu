"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

interface ProdukTerlaris {
  id: string
  name: string
  price: number
  quantitySold: number
  revenue?: number
}

interface ProdukTerlarisProps {
  data?: ProdukTerlaris[]
}

// Data dummy untuk contoh
const dummyData: ProdukTerlaris[] = [
  {
    id: "1",
    name: "Indomie Goreng",
    price: 3500,
    quantitySold: 1,
  },
]

export function ProdukTerlaris({ data = dummyData }: ProdukTerlarisProps) {
  const sortedData = [...data]
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5) 

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Produk Terlaris</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Top 5 produk berdasarkan penjualan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedData.map((produk, index) => (
          <div
            key={produk.id}
            className="flex items-center gap-4 py-2"
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {produk.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {produk.quantitySold} item terjual
              </div>
            </div>

            <div className="font-medium text-right">
              <div>{formatPrice(produk.revenue ?? produk.price)}</div>
              <div className="text-xs text-muted-foreground">Harga satuan: {formatPrice(produk.price)}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

