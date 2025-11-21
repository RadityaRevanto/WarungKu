"use client"

import { DataTable } from "../../_components/data-table";
import { SectionCards } from "../../_components/section-cards";
import data from "@/src/app/(dashboard)/data.json"

export default function AdminWarungProduk() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable data={data} />
      </div>
    </div>
  );
}