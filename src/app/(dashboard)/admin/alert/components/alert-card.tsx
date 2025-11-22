"use client"

import {
    Card,
    CardDescriptionAlert,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"

export function AlertCards() {
    return (
        <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
            <Card className="@container/card bg-pink-100 border-red-600">
                <CardHeader>
                    <CardDescriptionAlert className="text-red-600">Stok Habis</CardDescriptionAlert>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 text-red-600">
                        1
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-lg text-red-600">
                        Produk Perlu Restock
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card bg-yellow-100 border-yellow-600">
                <CardHeader>
                    <CardDescriptionAlert className="text-yellow-600">Stok Menipis</CardDescriptionAlert>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 text-yellow-600">
                        1
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-lg text-yellow-600">
                        Produk Segera Habis
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card bg-green-100 border-green-600">
                <CardHeader>
                    <CardDescriptionAlert className="text-green-600">Stok Habis</CardDescriptionAlert>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-4 text-green-600">
                        1
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-lg text-green-600">
                        Produk Stock Cukup
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
