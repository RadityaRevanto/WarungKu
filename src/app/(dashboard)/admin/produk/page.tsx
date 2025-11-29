"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/src/app/(dashboard)/_components/dashboard-layout";
import { createColumns } from "./components/column";
import { DataTable } from "./components/data-table";
import { MyFormData } from "./components/table";
import { useOnlineStatus } from "@/src/hooks/use-online-status";
import { offlineQueue } from "@/src/lib/offline-queue";
import { syncService } from "@/src/lib/sync-service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { UserForm } from "./components/form";
import { Badge } from "@/src/components/ui/badge";
import { Wifi, WifiOff, Cloud, CloudOff } from "lucide-react";

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isOnline = useOnlineStatus();
  const columns = createColumns();
  
  // Fetch products - harus didefinisikan sebelum digunakan
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/products");
      const productsData = await response.json();

      const tableData = productsData.map((p: any) => ({
        id: p.id,
        name_4603829743: p.name,
        name_0878515932: String(p.price),
        name_0706064476: p.stock,
        name_6646786819: p.barcode || "",
        name_6646786821: p.minStock ?? 10,
      }));

      setData(tableData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);
  
  useEffect(() => {
    setMounted(true);
    // Initialize offline queue
    offlineQueue.init().catch(console.error);
    
    // Start auto sync
    syncService.startAutoSync(5000).catch(console.error);
    
    // Update pending count periodically
    const updatePendingCount = async () => {
      const count = await offlineQueue.getPendingCount();
      setPendingCount(count);
    };
    
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch products on mount
  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [mounted, fetchProducts]);
  
  // Sync when coming back online
  useEffect(() => {
    if (isOnline && mounted) {
      syncService.syncPendingProducts().then(async () => {
        const count = await offlineQueue.getPendingCount();
        setPendingCount(count);
        // Refresh data setelah sync untuk menampilkan produk yang baru di-sinkronkan
        if (count === 0) {
          fetchProducts();
        }
      });
    }
  }, [isOnline, mounted, fetchProducts]);

  // Listen untuk event productsSynced
  useEffect(() => {
    const handleProductsSynced = () => {
      fetchProducts();
      offlineQueue.getPendingCount().then(setPendingCount);
    };

    window.addEventListener('productsSynced', handleProductsSynced);
    return () => {
      window.removeEventListener('productsSynced', handleProductsSynced);
    };
  }, [fetchProducts]);

  // ... rest of your handlers (handleCreate, handleUpdate, etc.)
  // [Gunakan kode yang sudah ada sebelumnya]

  const handleCreate = async (newRecord: Omit<MyFormData, "id">) => {
    const body = {
      name: newRecord.name_4603829743,
      price: Number(newRecord.name_0878515932),
      stock: newRecord.name_0706064476,
      barcode: String(newRecord.name_6646786819),
      minStock: newRecord.name_6646786821 ?? 10,
    };

    // Jika offline, simpan ke queue
    if (!isOnline) {
      try {
        await offlineQueue.addProduct({ data: body });
        const count = await offlineQueue.getPendingCount();
        setPendingCount(count);
        
        // Tampilkan di UI dengan temporary ID
        const tempId = `temp_${Date.now()}`;
        const newData = {
          id: tempId,
          name_4603829743: body.name,
          name_0878515932: String(body.price),
          name_0706064476: body.stock,
          name_6646786819: body.barcode || "",
          name_6646786821: body.minStock ?? 10,
        };
        
        setData((prev) => [...prev, newData]);
        setIsDialogOpen(false);
        setEditingUser(null);
        setDialogKey(prev => prev + 1);
        
        toast.success("Produk disimpan secara offline. Akan di-sinkronkan ketika online.");
        return;
      } catch (error) {
        console.error("Error saving to offline queue:", error);
        toast.error("Gagal menyimpan produk ke queue offline");
        return;
      }
    }

    // Jika online, kirim langsung ke server
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // Jika gagal, coba simpan ke queue
        if (!navigator.onLine) {
          await offlineQueue.addProduct({ data: body });
          const count = await offlineQueue.getPendingCount();
          setPendingCount(count);
          toast.warning("Koneksi terputus. Produk disimpan untuk sinkronisasi nanti.");
          return;
        }
        throw new Error("Failed to create product");
      }

      const created = await res.json();

      const newData = {
        id: created.id,
        name_4603829743: created.name,
        name_0878515932: String(created.price),
        name_0706064476: created.stock,
        name_6646786819: created.barcode || "",
        name_6646786821: created.minStock ?? 10,
      };

      setData((prev) => [...prev, newData]);
      setIsDialogOpen(false);
      setEditingUser(null);
      setDialogKey(prev => prev + 1);
      
      toast.success("Produk berhasil dibuat");
    } catch (error) {
      console.error("Create product error:", error);
      
      // Coba simpan ke queue jika error
      try {
        await offlineQueue.addProduct({ data: body });
        const count = await offlineQueue.getPendingCount();
        setPendingCount(count);
        toast.warning("Gagal mengirim ke server. Produk disimpan untuk sinkronisasi nanti.");
      } catch (queueError) {
        toast.error("Gagal membuat produk");
      }
    }
  };

  const handleUpdate = async (updatedUser: MyFormData) => {
    try {
      const body = {
        name: updatedUser.name_4603829743,
        price: Number(updatedUser.name_0878515932),
        stock: updatedUser.name_0706064476,
        barcode: String(updatedUser.name_6646786819),
        minStock: updatedUser.name_6646786821 ?? 10,
      };

      const res = await fetch(`/api/admin/products/${updatedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update product:", errorData);
        alert(`Error: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const updated = await res.json();

      setData((prevData) => {
        return prevData.map((record) => {
          if (record.id === updated.id) {
            return {
              id: updated.id,
              name_4603829743: updated.name,
              name_0878515932: String(updated.price),
              name_0706064476: updated.stock,
              name_6646786819: updated.barcode || "",
              name_6646786821: updated.minStock ?? 10,
            };
          }
          return record;
        });
      });

      setIsDialogOpen(false);
      setEditingUser(null);
      setDialogKey(prev => prev + 1);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      setData((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (record: MyFormData) => {
    const clonedRecord = JSON.parse(JSON.stringify(record)) as MyFormData;
    setEditingUser(clonedRecord);
    setIsDialogOpen(true);
    setDialogKey(prev => prev + 1);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
    setDialogKey(prev => prev + 1);
  };

  if (!mounted) {
    return null; // atau <LoadingSpinner />
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Status Indicator */}
        <div className="mb-4 flex items-center gap-2">
          {isOnline ? (
            <Badge variant="default" className="gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="outline" className="gap-1">
              {isOnline ? (
                <Cloud className="h-3 w-3" />
              ) : (
                <CloudOff className="h-3 w-3" />
              )}
              {pendingCount} produk menunggu sinkronisasi
            </Badge>
          )}
        </div>

        <Dialog
          key={dialogKey}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingUser(null);
              setDialogKey(prev => prev + 1);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit Product" : "Create Product"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Update product details below." : "Fill out the form to add a new product."}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              key={editingUser?.id || 'new'}
              initialData={editingUser}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
            />
          </DialogContent>
        </Dialog>

        <DataTable
          columns={columns}
          data={data}
          onAdd={openCreateDialog}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}