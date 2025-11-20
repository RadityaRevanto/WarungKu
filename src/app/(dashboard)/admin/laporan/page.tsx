"use client"

import { ChartAreaInteractive } from "@/src/app/(dashboard)/_components/chart-area-interactive"
import { DataTable } from "@/src/app/(dashboard)/_components/data-table"
import { SectionCards } from "@/src/app/(dashboard)/_components/section-cards"
import data from "@/src/app/(dashboard)/data.json"

export default function AdminWarungLaporan() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}