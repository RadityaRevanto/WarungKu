"use client"

import { useEffect, useState, useCallback } from "react"

import { DashboardLayout } from "@/src/app/(dashboard)/_components/dashboard-layout"
import { ChartAreaInteractive } from "@/src/app/(dashboard)/_components/chart-area-interactive"
import { ProdukTerlaris } from "@/src/app/(dashboard)/admin/laporan/components/produk-terlaris"
import { LaporanCard } from "@/src/app/(dashboard)/admin/laporan/components/laporan-card"

type SummaryData = {
  omzetToday: number
  transactionsToday: number
  itemsSoldToday: number
}

type ChartPoint = {
  date: string
  totalAmount: number
  transactions: number
  itemsSold: number
}

type TopProduct = {
  id: string
  name: string
  price: number
  quantitySold: number
  revenue: number
}

type LaporanResponse = {
  summary: SummaryData
  chart: ChartPoint[]
  topProducts: TopProduct[]
}

export default function AdminWarungLaporan() {
  const [laporan, setLaporan] = useState<LaporanResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLaporan = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/laporan")
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Gagal memuat laporan")
      }

      const data = (await response.json()) as LaporanResponse
      setLaporan(data)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLaporan()
  }, [fetchLaporan])

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <LaporanCard summary={laporan?.summary} isLoading={isLoading} />
          <div className="px-4 lg:px-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <ChartAreaInteractive data={laporan?.chart} isLoading={isLoading} />
          </div>
          <div className="px-4 lg:px-6">
            <ProdukTerlaris data={laporan?.topProducts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}