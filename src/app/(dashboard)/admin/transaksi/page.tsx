"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/src/app/(dashboard)/_components/dashboard-layout";
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
import { Toaster, toast } from "sonner";

type Product = {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
};

export default function AdminWarungTransaksi() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(
          data.map((p: any) => ({
            id: p.id,
            barcode: p.barcode || "",
            name: p.name,
            price: p.price,
            stock: p.stock,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Gagal memuat produk");
      }
    };

    if (mounted) {
      fetchProducts();
    }
  }, [mounted]);

  // Filter products based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      setShowSearchResults(false);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.barcode.toLowerCase().includes(searchLower)
    );

    setFilteredProducts(filtered);
    setShowSearchResults(true);
  }, [search, products]);

  const addToCartDirectly = (product: Product, quantity: number = 1) => {
    const currentQtyInCart = cart.find((c) => c.product.id === product.id)?.qty || 0;

    if (currentQtyInCart + quantity > product.stock) {
      toast.error(
        `Stock tidak cukup! Stock tersisa: ${product.stock}, di keranjang: ${currentQtyInCart}`
      );
      return;
    }

    const existing = cart.find((c) => c.product.id === product.id);

    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + quantity } : c
        )
      );
    } else {
      setCart([...cart, { product, qty: quantity }]);
    }

    toast.success(`${product.name} ditambahkan ke keranjang (${quantity}x)`);
  };

  const addToCart = () => {
    if (!selectedProduct) {
      toast.error("Pilih produk terlebih dahulu");
      return;
    }

    addToCartDirectly(selectedProduct, qty);
    setQty(1);
    setSelectedProduct(null);
  };

  // Handle selecting product from search results - AUTO ADD TO CART
  const handleSelectFromSearch = (product: Product) => {
    setSearch("");
    setShowSearchResults(false);

    // Langsung tambahkan ke cart dengan qty 1
    addToCartDirectly(product, 1);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const removeItem = (productId: string) => {
    setCart(cart.filter((c) => c.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang kosong. Tambahkan produk terlebih dahulu.");
      return;
    }

    setIsProcessing(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.qty,
        unitPrice: item.product.price,
      }));

      const response = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error);
      }

      const sale = await response.json();

      toast.success(`Transaksi Berhasil! Total: Rp ${total.toLocaleString()}`);
      printReceipt(sale);

      setCart([]);

      const refreshResponse = await fetch("/api/admin/products");
      const refreshedProducts = await refreshResponse.json();
      setProducts(
        refreshedProducts.map((p: any) => ({
          id: p.id,
          barcode: p.barcode || "",
          name: p.name,
          price: p.price,
          stock: p.stock,
        }))
      );
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = (sale: any) => {
    const printWindow = window.open("", "", "width=300,height=600");
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk Pembayaran</title>
        <style>
          body { font-family: 'Courier New', monospace; width: 280px; margin: 10px; font-size: 12px; }
          h2 { text-align: center; margin: 10px 0; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 14px; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <h2>WARUNG SAYA</h2>
        <div class="center">${new Date(sale.saleDate).toLocaleString("id-ID")}</div>
        <div class="divider"></div>
        ${sale.items
        .map(
          (item: any) => `
          <div class="item">
            <span>${item.product.name}</span>
          </div>
          <div class="item">
            <span>${item.quantity} x Rp ${item.unitPrice.toLocaleString()}</span>
            <span>Rp ${item.totalPrice.toLocaleString()}</span>
          </div>
        `
        )
        .join("")}
        <div class="divider"></div>
        <div class="item total">
          <span>TOTAL</span>
          <span>Rp ${sale.totalAmount.toLocaleString()}</span>
        </div>
        <div class="divider"></div>
        <div class="center">Terima Kasih!</div>
        <script>
          window.print();
          window.onafterprint = () => window.close();
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const startScan = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      const videoElement = document.getElementById("video-scan") as HTMLVideoElement;
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoElement);

      if (result) {
        const scannedBarcode = result.getText();

        // Find product by exact barcode match
        const found = products.find(
          (p) => p.barcode.toLowerCase() === scannedBarcode.toLowerCase()
        );

        if (found) {
          // Auto add to cart from scan with qty 1
          addToCartDirectly(found, 1);
        } else {
          toast.error(`Produk dengan barcode "${scannedBarcode}" tidak ditemukan`);
        }

        setIsScanning(false);
      }
    } catch (err) {
      console.error("Scan error:", err);
      toast.error("Scan gagal. Pastikan kamera aktif dan izin diberikan.");
      setIsScanning(false);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <Toaster />
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
                Cari produk atau scan barcode
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* SEARCH + SCAN */}
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <Input
                    placeholder="Cari produk (nama atau barcode)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => {
                      if (filteredProducts.length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                    className="h-12 rounded-xl"
                  />

                  {/* Search Results Dropdown */}
                  {showSearchResults && filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectFromSearch(product)}
                          className="w-full p-3 hover:bg-blue-50 text-left border-b last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            Rp {product.price.toLocaleString()} • Stock: {product.stock}
                            {product.barcode && (
                              <span className="ml-2 text-gray-400">
                                ({product.barcode})
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {showSearchResults && filteredProducts.length === 0 && search.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-10 p-4 text-center text-gray-500">
                      Produk tidak ditemukan
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="h-12 px-5 rounded-xl"
                  onClick={() => startScan()}
                >
                  <Scan className="mr-2 w-4 h-4" />
                  Scan
                </Button>
              </div>

              {/* Atau pemisah */}
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t"></div>
                <span className="text-gray-400 text-sm">atau pilih manual</span>
                <div className="flex-1 border-t"></div>
              </div>

              {/* SELECT - untuk pilih manual dengan custom qty */}
              <Select
                value={selectedProduct?.id}
                onValueChange={(val) => {
                  const p = products.find((x) => x.id === val);
                  setSelectedProduct(p || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih produk dari dropdown" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — Rp {p.price.toLocaleString()} (Stock: {p.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* QTY + BUTTON - hanya untuk manual select */}
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="h-12 rounded-xl text-center text-lg"
                />
                <Button
                  className="col-span-2 h-12 rounded-xl text-base flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800"
                  onClick={() => addToCart()}
                  disabled={!selectedProduct}
                >
                  <Plus className="w-4 h-4" />
                  Tambah ke Keranjang
                </Button>
              </div>

              {/* Selected Product Info */}
              {selectedProduct && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Produk dipilih:</p>
                  <p className="font-semibold">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">
                    Rp {selectedProduct.price.toLocaleString()} • Stock: {selectedProduct.stock}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT - Keranjang */}
          <Card className="rounded-2xl p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingCart className="w-5 h-5" />
                Keranjang ({cart.length} item)
              </CardTitle>
            </CardHeader>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.length === 0 && (
                <p className="text-center text-gray-400 py-8">Keranjang kosong</p>
              )}
              {cart.map((item) => (
                <div
                  key={item.product.id}
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
                                c.product.id === item.product.id
                                  ? { ...c, qty: c.qty - 1 }
                                  : c
                              )
                            );
                          }
                        }}
                        className="px-3 py-1 bg-gray-200 rounded-lg text-lg hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="px-4 py-2 bg-white rounded-lg">{item.qty}</span>

                      <button
                        onClick={() => {
                          if (item.qty < item.product.stock) {
                            setCart((prev) =>
                              prev.map((c) =>
                                c.product.id === item.product.id
                                  ? { ...c, qty: c.qty + 1 }
                                  : c
                              )
                            );
                          } else {
                            toast.error(`Stock maksimal: ${item.product.stock}`);
                          }
                        }}
                      className="px-3 py-1 bg-gray-200 rounded-lg text-lg hover:bg-gray-300"
                      >
                      +
                    </button>
                  </div>

                  <span className="font-semibold min-w-[100px] text-right">
                    Rp {(item.qty * item.product.price).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-700"
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
          <span className="font-semibold text-xl">Rp {total.toLocaleString()}</span>
        </div>

        <Button
          className="w-full mt-6 text-lg py-6 bg-green-600 hover:bg-green-700"
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
        >
          <Printer size={20} className="mr-2" />
          {isProcessing ? "Memproses..." : "Checkout & Print"}
        </Button>
      </Card>
    </div>
      </div >
    </DashboardLayout >
  );
}