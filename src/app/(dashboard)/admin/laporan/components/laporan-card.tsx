import { IconShoppingBag, IconTrendingUp } from "@tabler/icons-react"
import { DollarSign } from "lucide-react";

import {
  Card,
  CardDescriptionLaporan,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

type SummaryData = {
  omzetToday: number
  transactionsToday: number
  itemsSoldToday: number
}

type LaporanCardProps = {
  summary?: SummaryData | null
  isLoading?: boolean
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)

export function LaporanCard({ summary, isLoading }: LaporanCardProps) {
  const omzetToday = summary?.omzetToday ?? 0
  const transactionsToday = summary?.transactionsToday ?? 0
  const itemsSoldToday = summary?.itemsSoldToday ?? 0

  const shimmer = isLoading ? "animate-pulse bg-muted text-transparent rounded" : ""

  return (
    <div className="*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescriptionLaporan className="mb-4">Omzet Hari Ini</CardDescriptionLaporan>
            <DollarSign className="size-6 mb-3 mr-2 text-slate-600" />
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 ${shimmer}`}>
            {formatCurrency(omzetToday)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm -mt-5">
          <div className="text-muted-foreground text-lg font-semibold">Total Pendapatan hari Ini</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescriptionLaporan className="mb-4">Transaksi</CardDescriptionLaporan>
            <IconShoppingBag className="size-6 mb-3 mr-2 text-slate-600" />
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 ${shimmer}`}>
            {transactionsToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm -mt-5">
          <div className="text-muted-foreground text-lg font-semibold">Jumlah Transaksi Hari Ini</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescriptionLaporan className="mb-4">Item Terjual</CardDescriptionLaporan>
            <IconTrendingUp className="size-6 mb-3 mr-2 text-slate-600" />
          </div>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 ${shimmer}`}>
            {itemsSoldToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm -mt-5">
          <div className="text-muted-foreground text-lg font-semibold">Total item Terjual Hari Ini</div>
        </CardFooter>
      </Card>
    </div>
  )
}
