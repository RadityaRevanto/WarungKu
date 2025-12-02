"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/src/app/(dashboard)/_components/dashboard-layout";
import { createColumns } from "./components/column";
import { DataTable } from "./components/data-table";
import { MyFormData } from "./components/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { UserForm } from "./components/form";
import { Button } from "@/src/components/ui/button";
import { RefreshCw, Wifi, WifiOff, Cloud, CloudOff } from "lucide-react";
import { toast } from "sonner";
import { warungDB } from "@/src/lib/indexeddb"; // ← Ubah dari productDB ke warungDB
import { syncService } from "@/src/lib/sync-service";

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const columns = createColumns();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize IndexedDB and sync
  useEffect(() => {
    if (!mounted) return;

    const initDB = async () => {
      try {
        await warungDB.init(); // ← Ubah
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
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Kembali online! Syncing data...');
      syncService.manualSync().then(() => loadProductsFromIndexedDB());
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Mode offline. Perubahan akan disimpan lokal.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check pending changes periodically
  useEffect(() => {
    if (!mounted) return;

    const checkPending = async () => {
      const pending = await warungDB.getPendingChanges(); // ← Ubah
      setPendingChanges(pending.length);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Load products from IndexedDB
  const loadProductsFromIndexedDB = async () => {
    try {
      const products = await warungDB.getAllProducts(); // ← Ubah
      
      const tableData: MyFormData[] = products.map((p) => ({
        id: p.id,
        name_4603829743: p.name,
        name_0878515932: String(p.price),
        name_0706064476: p.stock,
        name_6646786819: p.barcode || "",
        name_6646786821: p.minStock,
      }));

      setData(tableData);
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      toast.error('Gagal memuat produk dari database lokal');
    }
  };

  // Create product (offline-first)
  const handleCreate = async (newRecord: Omit<MyFormData, "id">) => {
    try {
      const product = await warungDB.addProduct({ // ← Ubah
        name: newRecord.name_4603829743,
        price: Number(newRecord.name_0878515932),
        stock: newRecord.name_0706064476,
        barcode: String(newRecord.name_6646786819) || null,
        minStock: newRecord.name_6646786821 ?? 10,
        userId: 'current-user-id', // Replace with actual user ID
      });

      await loadProductsFromIndexedDB();
      
      setIsDialogOpen(false);
      setEditingUser(null);
      setDialogKey(prev => prev + 1);
      
      toast.success('Produk berhasil ditambahkan (offline)');

      // Trigger sync
      if (isOnline) {
        syncService.syncToServer().then(() => loadProductsFromIndexedDB());
      }
    } catch (error) {
      console.error("Create product error:", error);
      toast.error('Gagal menambahkan produk');
    }
  };

  // Update product (offline-first)
  const handleUpdate = async (updatedUser: MyFormData) => {
    try {
      await warungDB.updateProduct(updatedUser.id, { // ← Ubah
        name: updatedUser.name_4603829743,
        price: Number(updatedUser.name_0878515932),
        stock: updatedUser.name_0706064476,
        barcode: String(updatedUser.name_6646786819) || null,
        minStock: updatedUser.name_6646786821 ?? 10,
      } as any);

      await loadProductsFromIndexedDB();
      
      setIsDialogOpen(false);
      setEditingUser(null);
      setDialogKey(prev => prev + 1);
      
      toast.success('Produk berhasil diupdate (offline)');

      // Trigger sync
      if (isOnline) {
        syncService.syncToServer().then(() => loadProductsFromIndexedDB());
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Gagal mengupdate produk');
    }
  };

  // Delete product (offline-first)
  const handleDelete = async (id: string) => {
    try {
      await warungDB.deleteProduct(id); // ← Ubah
      await loadProductsFromIndexedDB();
      
      toast.success('Produk berhasil dihapus (offline)');

      // Trigger sync
      if (isOnline) {
        syncService.syncToServer().then(() => loadProductsFromIndexedDB());
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus produk');
    }
  };

  // Open edit dialog
  const handleEdit = (record: MyFormData) => {
    const clonedRecord = JSON.parse(JSON.stringify(record)) as MyFormData;
    setEditingUser(clonedRecord);
    setIsDialogOpen(true);
    setDialogKey(prev => prev + 1);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
    setDialogKey(prev => prev + 1);
  };

  // Manual sync
// Manual sync
const handleManualSync = async () => {
  if (!isOnline) {
    toast.error('Tidak dapat sync saat offline');
    return;
  }

  setIsSyncing(true);
  try {
    await syncService.manualSync();
    await loadProductsFromIndexedDB();
    toast.success('Sinkronisasi berhasil!');
  } catch (error) {
    console.error('Sync error:', error);
    toast.error(error instanceof Error ? error.message : 'Gagal melakukan sinkronisasi');
  } finally {
    setIsSyncing(false);
  }
};

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
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
                  {pendingChanges} perubahan belum tersinkron
                </span>
              </div>
            )}

            {pendingChanges === 0 && isOnline && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <Cloud className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Semua data tersinkron
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
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
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