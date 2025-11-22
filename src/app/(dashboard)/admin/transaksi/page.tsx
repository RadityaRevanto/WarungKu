"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { ShoppingCart, Plus, Trash2, Printer, Scan } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function AdminWarungTransaksi() {
  type Product = {
    barcode: string;
    name: string;
    price: number;
  };

  // DAFTAR PRODUK
  const products: Product[] = [
    { barcode: "8991234561111", name: "Indomie Goreng", price: 3500 },
    { barcode: "8991234562222", name: "Air Mineral 330ml", price: 3500 },
    { barcode: "8991002135376", name: "Kapal Api Sachet", price: 3500 },
  ];

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);

  // SCAN STATE
  const [isScanning, setIsScanning] = useState(false);

  // -------------------------------
  // AUTO SELECT + AUTO ADD TO CART
  // -------------------------------
  useEffect(() => {
    if (!search) return;

    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === search.toLowerCase() ||
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (found) {
      setSelectedProduct(found);
      addToCart(found);
    }
  }, [search]);

  // -------------------------------
  const addToCart = (productOverride?: Product) => {
    const product = productOverride || selectedProduct;
    if (!product) return;

    const existing = cart.find((c) => c.product.barcode === product.barcode);

    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.product.barcode === product.barcode ? { ...c, qty: c.qty + qty } : c
        )
      );
    } else {
      setCart([...cart, { product, qty }]);
    }

    setQty(1);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const removeItem = (barcode: string) => {
    setCart(cart.filter((c) => c.product.barcode !== barcode));
  };

  // -------------------------------
  // SCAN BARCODE
  // -------------------------------
  const startScan = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      const videoElement = document.getElementById(
        "video-scan"
      ) as HTMLVideoElement;

      const result = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        videoElement
      );

      if (result) {
        setSearch(result.getText());
        setIsScanning(false);
        // codeReader.reset();
      }
    } catch (err) {
      console.error("Scan error:", err);
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      {/* SCANNER POPUP */}
      {isScanning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Scanning Barcode...</h2>

            <video
              id="video-scan"
              className="w-full h-64 bg-black rounded-lg"
              autoPlay
            ></video>

            <Button
              className="mt-4 w-full bg-red-600 hover:bg-red-700"
              onClick={() => setIsScanning(false)}
            >
              Stop Scan
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <Card className="rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="w-5 h-5" /> Tambah Item
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Pilih produk dan masukkan jumlah
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* SEARCH + SCAN */}
            <div className="flex gap-2">
              <Input
                placeholder="Cari produk atau scan barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-xl"
              />

              <Button
                variant="outline"
                className="h-12 px-5 rounded-xl"
                onClick={() => startScan()}
              >
                <Scan className="mr-2 w-4 h-4" />
                Scan
              </Button>
            </div>

            {/* SELECT */}
            <Select
              value={selectedProduct?.barcode}
              onValueChange={(val) => {
                const p = products.find((x) => x.barcode === val);
                setSelectedProduct(p || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih produk" />
              </SelectTrigger>

              <SelectContent className="w-full">
                {products.map((p) => (
                  <SelectItem key={p.barcode} value={p.barcode}>
                    {p.name} — Rp {p.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* QTY + BUTTON */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="h-12 rounded-xl text-center text-lg"
              />

              <Button
                className="col-span-2 h-12 rounded-xl text-base flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800"
                onClick={() => addToCart()}
              >
                <Plus className="w-4 h-4" />
                Tambah ke Keranjang
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card className="rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="w-5 h-5" />
              Keranjang
            </CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {cart.length === 0 && (
              <p className="text-center text-gray-400">Keranjang kosong</p>
            )}
            {cart.map((item) => (
              <div
                key={item.product.barcode}
                className="p-4 rounded-xl bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-gray-500">
                    Rp {item.product.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.qty > 1) {
                          setCart((prev) =>
                            prev.map((c) =>
                              c.product.barcode === item.product.barcode
                                ? { ...c, qty: c.qty - 1 }
                                : c
                            )
                          );
                        }
                      }}
                      className="px-3 py-1 bg-gray-200 rounded-lg text-lg"
                    >
                      -
                    </button>

                    <span className="px-4 py-2 bg-white rounded-lg">{item.qty}</span>

                    <button
                      onClick={() => {
                        setCart((prev) =>
                          prev.map((c) =>
                            c.product.barcode === item.product.barcode
                              ? { ...c, qty: c.qty + 1 }
                              : c
                          )
                        );
                      }}
                      className="px-3 py-1 bg-gray-200 rounded-lg text-lg"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-semibold">
                    Rp {(item.qty * item.product.price).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeItem(item.product.barcode)}
                    className="text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between text-lg mt-6 pt-3 border-t">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">Rp {total.toLocaleString()}</span>
          </div>

          <Button className="w-full mt-6 text-lg py-6 bg-green-600 hover:bg-green-700">
            <Printer size={20} className="mr-2" />
            Checkout & Print
          </Button>
        </Card>
      </div>
    </div>
  );
}
