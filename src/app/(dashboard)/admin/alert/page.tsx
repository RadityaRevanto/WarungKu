"use client"

export default function AdminWarungAlert() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alert</h1>
      <div className="space-y-4">
        {/* Konten Alert Anda */}
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800">Stok Rendah</h3>
          <p className="text-sm text-yellow-700">Produk A tersisa 5 unit</p>
        </div>
        
        <div className="border rounded-lg p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800">Stok Habis</h3>
          <p className="text-sm text-red-700">Produk B sudah habis</p>
        </div>
      </div>
    </div>
  )
}