// Service untuk sinkronisasi produk dari offline queue ke server

import { offlineQueue, type PendingProduct } from './offline-queue';
import { toast } from 'sonner';

export class SyncService {
  private isSyncing = false;

  async syncPendingProducts(): Promise<void> {
    if (this.isSyncing) {
      return;
    }

    // Cek apakah online
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return;
    }

    this.isSyncing = true;

    try {
      const pendingProducts = await offlineQueue.getAllPendingProducts();

      if (pendingProducts.length === 0) {
        this.isSyncing = false;
        return;
      }

      const syncPromises = pendingProducts.map(async (pending) => {
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pending.data),
          });

          if (!response.ok) {
            throw new Error(`Failed to sync: ${response.statusText}`);
          }

          // Hapus dari queue jika berhasil
          await offlineQueue.removeProduct(pending.id);
          return { success: true, id: pending.id };
        } catch (error) {
          console.error(`Failed to sync product ${pending.id}:`, error);
          // Update retry count
          await offlineQueue.updateProductRetries(pending.id, pending.retries + 1);
          return { success: false, id: pending.id };
        }
      });

      const results = await Promise.allSettled(syncPromises);
      const successCount = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      ).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} produk berhasil di-sinkronkan`);
        // Trigger custom event untuk memberitahu komponen lain
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('productsSynced', { detail: { count: successCount } }));
        }
      }
      if (failCount > 0) {
        toast.error(`${failCount} produk gagal di-sinkronkan`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Gagal melakukan sinkronisasi');
    } finally {
      this.isSyncing = false;
    }
  }

  async startAutoSync(intervalMs: number = 5000): Promise<void> {
    // Sync immediately
    await this.syncPendingProducts();

    // Set up interval
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (navigator.onLine) {
          this.syncPendingProducts();
        }
      }, intervalMs);
    }
  }
}

export const syncService = new SyncService();

