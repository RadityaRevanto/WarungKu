"use client"

import {
    Card,
    CardDescriptionAlert,
    CardHeader,
} from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { TriangleAlert, CheckCircle, Box } from "lucide-react"

export function CardData() {
    return (
        <div className="gap-10 flex flex-col">
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-red-400 bg-red-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TriangleAlert className="text-red-600 size-8" />
                            <CardDescriptionAlert className="text-red-600 text-3xl">Stok Habis</CardDescriptionAlert>
                        </div>
                        <CardDescriptionAlert className="text-slate-500">Produk berikut sudah habis dan tidak bisa dijual</CardDescriptionAlert>
                        <div className="mt-4 space-y-2">
                            <Card className="@container/card border-red-400 bg-pink-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TriangleAlert className="text-black-600 size-5" />
                                            <CardDescriptionAlert className="text-black-600 text-xl">Soto</CardDescriptionAlert>
                                        </div>
                                        <Badge className="bg-red-600 text-white border-red-600 rounded-sm px-3 py-2">Stok: 0</Badge>
                                    </div>
                                    <CardDescriptionAlert className="text-red-600 text-xl font-normal">Rp 120</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-yellow-400 bg-yellow-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TriangleAlert className="text-orange-600 size-8" />
                            <CardDescriptionAlert className="text-yellow-600 text-3xl">Stok Menipis</CardDescriptionAlert>
                        </div>
                        <CardDescriptionAlert className="text-slate-500">Produk berikut stoknya di bawah batas minimum</CardDescriptionAlert>
                        <div className="mt-4 space-y-2">
                            <Card className="@container/card border-yellow-400 bg-yellow-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TriangleAlert className="text-black-600 size-5 " />
                                            <CardDescriptionAlert className="text-black-600 text-xl">Kapal Api</CardDescriptionAlert>
                                        </div>
                                        <Badge className="bg-orange-600 text-white border-orange-600 rounded-sm px-3 py-2">Stok: 10</Badge>
                                    </div>
                                    <CardDescriptionAlert className="text-yellow-600 text-xl font-normal">Rp 10.000 | Min: 10</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6">
                <Card className="@container/card border-green-400 bg-green-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-green-600 size-8" />
                            <CardDescriptionAlert className="text-green-600 text-3xl">Stok Aman</CardDescriptionAlert>
                        </div>
                        <CardDescriptionAlert className="text-slate-500">Produk dengan stok mencukupi</CardDescriptionAlert>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <Card className="@container/card border-green-400 bg-green-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Box className="text-black-600 size-5" />
                                            <CardDescriptionAlert className="text-black-600 text-xl">Indomie Goreng</CardDescriptionAlert>
                                        </div>
                                        <Badge className="bg-green-600 text-white border-green-600 rounded-sm px-5 py-2">49</Badge>
                                    </div>
                                    <CardDescriptionAlert className="text-green-600 text-xl font-normal">Rp 3.500</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                            <Card className="@container/card border-green-400 bg-green-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Box className="text-black-600 size-5" />
                                            <CardDescriptionAlert className="text-black-600 text-xl">Teh Pucuk</CardDescriptionAlert>
                                        </div>
                                        <Badge className="bg-green-600 text-white border-green-600 rounded-sm px-5 py-2">25</Badge>
                                    </div>
                                    <CardDescriptionAlert className="text-green-600 text-xl font-normal">Rp 5.000</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                            <Card className="@container/card border-green-400 bg-green-100">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Box className="text-black-600 size-5" />
                                            <CardDescriptionAlert className="text-black-600 text-xl">Aqua 600ml</CardDescriptionAlert>
                                        </div>
                                        <Badge className="bg-green-600 text-white border-green-600 rounded-sm px-5 py-2">30</Badge>
                                    </div>
                                    <CardDescriptionAlert className="text-green-600 text-xl font-normal">Rp 4.000</CardDescriptionAlert>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
