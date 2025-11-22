"use client"

import {
    Card,
    CardDescriptionAlert,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"

export function CardData() {
    return (
        <div className="gap-10 flex flex-col">
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-red-400">
                    <CardHeader>
                        <CardDescriptionAlert className="text-red-600 text-3xl">Stok Habis</CardDescriptionAlert>
                        <CardDescriptionAlert className="text-slate-500">Produk Berikut Sudah Habis Dan Tidak Bisa Di Jual</CardDescriptionAlert>
                        <div>
                            <Card className="@container/card border-red-400 bg-pink-100">
                                <CardHeader>
                                    <CardDescriptionAlert className="text-red-600 text-xl">Teh Pucuk</CardDescriptionAlert>
                                    <CardDescriptionAlert className="text-red-600 text-xl font-normal">Rp.3000</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-yellow-400">
                    <CardHeader>
                        <CardDescriptionAlert className="text-yellow-600 text-3xl">Stok Habis</CardDescriptionAlert>
                        <CardDescriptionAlert className="text-slate-500">Produk Berikut Stoknya Di Bawah Batas Minimum</CardDescriptionAlert>
                        <div>
                            <Card className="@container/card border-yellow-400 bg-yellow-100">
                                <CardHeader>
                                    <CardDescriptionAlert className="text-yellow-600 text-xl">Teh Pucuk</CardDescriptionAlert>
                                    <CardDescriptionAlert className="text-yellow-600 text-xl font-normal">Rp.3000</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-green-400">
                    <CardHeader>
                        <CardDescriptionAlert className="text-green-600 text-3xl">Stok Habis</CardDescriptionAlert>
                        <CardDescriptionAlert className="text-slate-500">Produk Dengan Stok Mencukupi</CardDescriptionAlert>
                        <div>
                            <Card className="@container/card border-green-400 bg-green-100">
                                <CardHeader>
                                    <CardDescriptionAlert className="text-green-600 text-xl">Teh Pucuk</CardDescriptionAlert>
                                    <CardDescriptionAlert className="text-green-600 text-xl font-normal">Rp.3000</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
