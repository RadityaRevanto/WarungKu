"use client"

import { AlertCards } from "@/src/app/(dashboard)/admin/alert/components/alert-card"
import { CardData } from "@/src/app/(dashboard)/admin/alert/components/card-data"

export default function AdminWarungAlert() {
  return (
    <div className="w-full min-h-screen bg-">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <AlertCards />
        <div className="pt-2 lg:pt-2">
          <CardData />
        </div>
      </div>
    </div>
  )
}