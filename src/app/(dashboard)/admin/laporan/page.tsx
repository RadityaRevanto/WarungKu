"use client"

import { ChartAreaInteractive } from "@/src/app/(dashboard)/_components/chart-area-interactive"
import { ProdukTerlaris } from "@/src/app/(dashboard)/admin/laporan/components/produk-terlaris"
import { LaporanCard } from "@/src/app/(dashboard)/admin/laporan/components/laporan-card"

export default function AdminWarungLaporan() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <LaporanCard />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <div className="px-4 lg:px-6">
          <ProdukTerlaris />
        </div>
      </div>
    </div>
  );
}