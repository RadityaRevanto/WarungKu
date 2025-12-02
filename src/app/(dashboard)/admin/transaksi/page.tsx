"use client";

import { useState, useEffect, useRef } from "react";
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
import { ShoppingCart, Plus, Trash2, Printer, Scan, Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Toaster, toast } from "sonner";
import { warungDB, Product } from "@/src/lib/indexeddb";
import { syncService } from "@/src/lib/sync-service";
import { Html5Qrcode } from "html5-qrcode";


type CartProduct = {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
};

export default function AdminWarungTransaksi() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<{ product: CartProduct; qty: number }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<CartProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  const scannerRef = useRef<Html5Qrcode | null>(null);


  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize DB and sync
  useEffect(() => {
    if (!mounted) return;

    const initDB = async () => {
      try {
        await warungDB.init();
        await loadProductsFromIndexedDB();
        
        // Start auto sync
        syncService.startAutoSync(30000);
        
        // Initial sync from server
        await syncService.syncFromServer();
        await loadProductsFromIndexedDB();
      } catch (error) {
        console.error('Failed to init DB:', error);
        toast.error('Gagal menginisialisasi database lokal');
      }
    };

    initDB();

    return () => {
      syncService.stopAutoSync();
    };
  }, [mounted]);

  // Monitor online/offline status
// Monitor online/offline status - FIXED
useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    toast.success("Kembali online! Syncing data...");
    
    // Wrap in Promise to catch all errors
    Promise.resolve().then(async () => {
      try {
        await syncService.manualSync();
        await loadProductsFromIndexedDB();
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Sync on reconnect failed:', error);
          toast.error('Gagal sync data. Akan dicoba lagi otomatis.');
        }
      }
    }).catch((err) => {
      // Last resort catch
      console.error('Caught in outer promise:', err);
    });
  };

  const handleOffline = () => {
    try {
      setIsOnline(false);
      toast.warning("Mode offline. Transaksi akan disimpan lokal.");
    } catch (error) {
      console.error('Offline handler error:', error);
    }
  };

  // Wrap addEventListener with try-catch
  try {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
  } catch (error) {
    console.error('Error adding event listeners:', error);
  }

  return () => {
    try {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    } catch (error) {
      console.error('Error removing event listeners:', error);
    }
  };
}, []);

// Check pending changes - FIXED
useEffect(() => {
  if (!mounted) return;

  const checkPending = async () => {
    try {
      const pending = await warungDB.getPendingChanges();
      setPendingChanges(pending.length);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error checking pending changes:', error);
      }
    }
  };

  checkPending().catch(err => {
    console.error('Initial checkPending error:', err);
  });
  
  const interval = setInterval(() => {
    checkPending().catch(err => {
      console.error('Interval checkPending error:', err);
    });
  }, 5000);

  return () => clearInterval(interval);
}, [mounted]);

// Initialize DB and sync - FIXED
useEffect(() => {
  if (!mounted) return;

  const initDB = async () => {
    try {
      await warungDB.init();
      await loadProductsFromIndexedDB();

      // Start auto sync
      syncService.startAutoSync(30000);

      // Initial sync from server (if online)
      if (navigator.onLine) {
        try {
          await syncService.syncFromServer();
          await loadProductsFromIndexedDB();
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Initial sync failed:', error);
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Failed to init DB:", error);
        toast.error("Gagal menginisialisasi database lokal");
      }
    }
  };

  initDB().catch((error) => {
    console.error('InitDB outer catch:', error);
  });

  return () => {
    try {
      syncService.stopAutoSync();
    } catch (error) {
      console.error('Error stopping sync:', error);
    }
  };
}, [mounted]);

  // Check pending changes
  useEffect(() => {
    if (!mounted) return;

    const checkPending = async () => {
      const pending = await warungDB.getPendingChanges();
      setPendingChanges(pending.length);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Load products from IndexedDB
  const loadProductsFromIndexedDB = async () => {
    try {
      const dbProducts = await warungDB.getAllProducts();
      
      setProducts(
        dbProducts.map((p) => ({
          id: p.id,
          barcode: p.barcode || "",
          name: p.name,
          price: p.price,
          stock: p.stock,
        }))
      );
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Gagal memuat produk");
    }
  };

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

  const addToCartDirectly = (product: CartProduct, quantity: number = 1) => {
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

  const handleSelectFromSearch = (product: CartProduct) => {
    setSearch("");
    setShowSearchResults(false);
    addToCartDirectly(product, 1);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const removeItem = (productId: string) => {
    setCart(cart.filter((c) => c.product.id !== productId));
  };

  // Checkout dengan offline-first
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

      // Save to IndexedDB (offline-first)
      const { sale, items: saleItems } = await warungDB.createSale(
        items,
        'current-user-id' // Replace with actual user ID
      ); toast.success(`Transaksi Berhasil! Total: Rp ${total.toLocaleString()} ${!isOnline ? '(Offline)' : ''}`);
  
  // Print receipt
  printReceipt({
    ...sale,
    items: saleItems.map(item => ({
      product: { name: item.productName },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
  });

  // Clear cart
  setCart([]);
  
  // Reload products (stock updated)
  await loadProductsFromIndexedDB();

  // Trigger sync if online
  if (isOnline) {
    syncService.syncToServer().then(() => {
      loadProductsFromIndexedDB();
      toast.success('Data tersinkron ke server');
    });
  } else {
    toast.info('Transaksi akan disinkronkan saat online kembali');
  }
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
// Ganti startScan function
const startScan = () => {
  setIsScanning(true);

  setTimeout(() => {
    if (!scannerRef.current) {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 350 } },
        (decodedText) => {
          const found = products.find(
            (p) => p.barcode.toLowerCase() === decodedText.toLowerCase()
          );

          if (found) {
            addToCartDirectly(found, 1);
            toast.success(`Produk ${found.name} berhasil ditambahkan`);
          } else {
            toast.error(`Produk dengan barcode "${decodedText}" tidak ditemukan`);
          }

          stopScan(); // hentikan scanner setelah berhasil scan
        },
        (err) => {
          console.warn("Scan error:", err);
        }
      ).catch((err) => {
        console.error("Scanner gagal dijalankan:", err);
        toast.error("Gagal mengakses kamera");
        stopScan();
      });
    }
  }, 100);
};


const stopScan = () => {
  if (scannerRef.current) {
    scannerRef.current.stop().catch(() => {});
    scannerRef.current = null;
  }
  setIsScanning(false);
};

const handleManualSync = async () => {
setIsSyncing(true);
try {
await syncService.manualSync();
await loadProductsFromIndexedDB();
toast.success('Sinkronisasi berhasil!');
} catch (error) {
console.error('Sync error:', error);
toast.error('Gagal melakukan sinkronisasi');
} finally {
setIsSyncing(false);
}
};
if (!mounted) return null;
return (
<DashboardLayout>
<Toaster />
<div className="p-6 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
{/* Status Bar */}
<div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
{isOnline ? (
<>
<Wifi className="w-5 h-5 text-green-600" />
<span className="text-sm font-medium text-green-600">Online</span>
</>
) : (
<>
<WifiOff className="w-5 h-5 text-orange-600" />
<span className="text-sm font-medium text-orange-600">Offline</span>
</>
)}
</div>
        {pendingChanges > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
            <CloudOff className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">
              {pendingChanges} pending sync
            </span>
          </div>
        )}

        {pendingChanges === 0 && isOnline && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <Cloud className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Tersinkron
            </span>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleManualSync}
        disabled={isSyncing || !isOnline}
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync'}
      </Button>
    </div>

{isScanning && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-xl shadow-xl w-[90%] max-w-md">
      <h2 className="text-lg font-semibold mb-2">Scanning Barcode...</h2>
      <div id="reader" className="w-full h-64 bg-black rounded-lg overflow-hidden" />
      <Button
        className="mt-4 w-full bg-red-600 hover:bg-red-700"
        onClick={stopScan}
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

          {/* SELECT */}
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

          {/* QTY + BUTTON */}
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
  </div>
</DashboardLayout>
);
}