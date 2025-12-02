// src/lib/sync-service.ts
import { warungDB, Product, Sale } from './indexeddb';

class SyncService {
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private localToServerIdMap: Map<string, string> = new Map();
  private abortController: AbortController | null = null;

  startAutoSync(intervalMs: number = 30000) {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      // Only sync if online
      if (navigator.onLine) {
        this.syncToServer().catch(err => {
          console.error('Auto sync error:', err);
          // Don't throw - just log
        });
      } else {
        console.log('⏭️ Offline - skipping auto sync');
      }
    }, intervalMs);

    // Initial sync if online
    if (navigator.onLine) {
      this.syncFromServer().catch(err => {
        console.error('Initial sync error:', err);
      });
    }
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Abort any ongoing requests
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Sync FROM server TO local (download)
  async syncFromServer(): Promise<void> {
    // Check online status
    if (!navigator.onLine) {
      console.log('⏭️ Offline - skipping sync from server');
      return;
    }

    // Create new abort controller
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      console.log('🔄 Syncing FROM server...');
      
      // Sync products
      try {
        const productsResponse = await fetch('/api/admin/products', { signal });
        
        if (productsResponse.ok) {
          const serverProducts = await productsResponse.json();
          
          const localProducts: Product[] = serverProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock,
            barcode: p.barcode,
            minStock: p.minStock,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            userId: p.userId,
            syncStatus: 'synced' as const,
            lastSyncedAt: new Date().toISOString(),
          }));

          await warungDB.bulkUpdateProducts(localProducts);
          console.log('✅ Products synced:', localProducts.length);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Products sync aborted');
          return;
        }
        throw err;
      }

      // Sync sales
      try {
        const salesResponse = await fetch('/api/admin/sales', { signal });
        
        if (salesResponse.ok) {
          const serverSales = await salesResponse.json();
          await warungDB.bulkUpdateSales(serverSales);
          console.log('✅ Sales synced:', serverSales.length);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Sales sync aborted');
          return;
        }
        throw err;
      }
      
      console.log('✅ Sync FROM server complete');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Sync from server aborted');
        return;
      }
      console.error('❌ Sync FROM server failed:', error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  // Sync TO server FROM local (upload)
  async syncToServer(): Promise<void> {
    // Check online status
    if (!navigator.onLine) {
      console.log('⏭️ Offline - skipping sync to server');
      return;
    }

    if (this.syncInProgress) {
      console.log('⏭️ Sync already in progress, skipping...');
      return;
    }

    this.syncInProgress = true;

    try {
      console.log('🔄 Syncing TO server...');
      
      const pendingChanges = await warungDB.getPendingChanges();
      
      if (pendingChanges.length === 0) {
        console.log('✅ No pending changes to sync');
        return;
      }

      console.log(`📤 Syncing ${pendingChanges.length} pending changes...`);

      // Sort: products first, then sales (to avoid FK constraints)
      const sortedChanges = pendingChanges.sort((a, b) => {
        if (a.entity === 'product' && b.entity === 'sale') return -1;
        if (a.entity === 'sale' && b.entity === 'product') return 1;
        return 0;
      });

      for (const change of sortedChanges) {
        try {
          if (change.entity === 'product') {
            if (change.type === 'create') {
              const serverId = await this.syncCreateProduct(change.data);
              if (serverId) {
                this.localToServerIdMap.set(change.entityId, serverId);
              }
            } else if (change.type === 'update') {
              await this.syncUpdateProduct(change.entityId, change.data);
            } else if (change.type === 'delete') {
              await this.syncDeleteProduct(change.entityId);
            }
          } else if (change.entity === 'sale') {
            if (change.type === 'sale') {
              await this.syncCreateSale(change.data);
            }
          }

          // Remove from pending queue
          if (change.id) {
            await warungDB.clearPendingChange(change.id);
          }
        } catch (error: any) {
          // Skip abort errors
          if (error.name === 'AbortError') {
            console.log(`Sync aborted for change ${change.id}`);
            continue;
          }
          
          console.error(`❌ Failed to sync change ${change.id}:`, error);
          await warungDB.markAsError(change.entity, change.entityId);
          // Don't throw - continue with next change
        }
      }

      console.log('✅ Sync TO server complete');
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('❌ Sync TO server failed:', error);
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncCreateProduct(product: Product): Promise<string | null> {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          stock: product.stock,
          barcode: product.barcode,
          minStock: product.minStock,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Create product error:', errorData);
        throw new Error(errorData.error || 'Failed to create product on server');
      }

      const created = await response.json();

      // Update local with server ID
      await warungDB.deleteProduct(product.id);
      await warungDB.bulkUpdateProducts([{
        ...product,
        id: created.id,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      }]);

      console.log(`✅ Product synced: ${product.id} → ${created.id}`);
      return created.id;
    } catch (error) {
      console.error('Sync create product error:', error);
      throw error;
    }
  }

  private async syncUpdateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    // Skip if local ID (not yet created on server)
    if (productId.startsWith('local_product_')) {
      console.log(`⏭️ Skipping update for local product: ${productId}`);
      return;
    }

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updates.name,
        price: updates.price,
        stock: updates.stock,
        barcode: updates.barcode,
        minStock: updates.minStock,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update product on server');
    }

    await warungDB.markProductAsSynced(productId);
  }

  private async syncDeleteProduct(productId: string): Promise<void> {
    // Skip if local ID (not yet created on server)
    if (productId.startsWith('local_product_')) {
      console.log(`⏭️ Skipping delete for local product: ${productId}`);
      return;
    }

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product on server');
    }
  }

  private async syncCreateSale(data: { sale: Sale; items: any[] }): Promise<void> {
    const { sale, items } = data;

    // Check if all products have been synced first
    for (const item of items) {
      if (item.productId.startsWith('local_product_')) {
        const serverId = this.localToServerIdMap.get(item.productId);
        
        if (!serverId) {
          const product = await warungDB.getProduct(item.productId);
          
          if (!product || product.syncStatus !== 'synced') {
            console.log(`⏭️ Skipping sale sync - product ${item.productId} not synced yet`);
            throw new Error(`Product ${item.productName} not synced yet`);
          }
          
          item.productId = product.id;
        } else {
          item.productId = serverId;
        }
      }
    }

    const apiItems = items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const response = await fetch('/api/admin/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: apiItems }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Create sale error:', error);
      throw new Error(error.details || error.error || 'Failed to create sale on server');
    }

    const created = await response.json();
    await warungDB.markSaleAsSynced(sale.id);
    
    console.log(`✅ Sale synced: ${sale.id}`);
  }

  // Manual sync trigger
  async manualSync(): Promise<void> {
    if (!navigator.onLine) {
      console.log('⏭️ Offline - cannot manual sync');
      throw new Error('Cannot sync while offline');
    }
    
    await this.syncToServer();
    await this.syncFromServer();
  }
}

export const syncService = new SyncService();