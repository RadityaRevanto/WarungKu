// src/lib/indexeddb.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string | null;
  minStock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncedAt?: string;
}

interface Sale {
  id: string;
  totalAmount: number;
  saleDate: string;
  userId: string;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncedAt?: string;
}

interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string; // Denormalized for offline display
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface MyDB extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: {
      'by-sync-status': string;
      'by-barcode': string;
      'by-name': string;
    };
  };
  sales: {
    key: string;
    value: Sale;
    indexes: {
      'by-sync-status': string;
      'by-date': string;
      'by-user': string;
    };
  };
  saleItems: {
    key: string;
    value: SaleItem;
    indexes: {
      'by-sale': string;
      'by-product': string;
    };
  };
  pendingChanges: {
    key: number;
    value: {
      id?: number;
      type: 'create' | 'update' | 'delete' | 'sale';
      entity: 'product' | 'sale';
      entityId: string;
      data: any;
      timestamp: number;
    };
  };
}

class WarungDB {
  private db: IDBPDatabase<MyDB> | null = null;
  private dbName = 'warung-db';
  private version = 2; // Increment version

async init() {
  if (this.db) return this.db;

  try {
    this.db = await openDB<MyDB>(this.dbName, this.version, {
      upgrade(db, oldVersion, newVersion, transaction) {
        try {
          // Products store
          if (!db.objectStoreNames.contains('products')) {
            const productStore = db.createObjectStore('products', { keyPath: 'id' });
            productStore.createIndex('by-sync-status', 'syncStatus');
            productStore.createIndex('by-barcode', 'barcode');
            productStore.createIndex('by-name', 'name');
          }

          // Sales store
          if (!db.objectStoreNames.contains('sales')) {
            const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
            salesStore.createIndex('by-sync-status', 'syncStatus');
            salesStore.createIndex('by-date', 'saleDate');
            salesStore.createIndex('by-user', 'userId');
          }

          // Sale Items store
          if (!db.objectStoreNames.contains('saleItems')) {
            const saleItemsStore = db.createObjectStore('saleItems', { keyPath: 'id' });
            saleItemsStore.createIndex('by-sale', 'saleId');
            saleItemsStore.createIndex('by-product', 'productId');
          }

          // Pending changes store
          if (!db.objectStoreNames.contains('pendingChanges')) {
            db.createObjectStore('pendingChanges', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
          }
        } catch (upgradeError) {
          console.error('Error during DB upgrade:', upgradeError);
          throw upgradeError;
        }
      },
      blocked() {
        console.warn('DB upgrade blocked - another tab might be open');
      },
      blocking() {
        console.warn('DB is blocking a newer version');
      },
      terminated() {
        console.error('DB connection was terminated');
      },
    });

    return this.db;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    this.db = null;
    throw error;
  }
}

  // ==================== PRODUCT OPERATIONS ====================

  async getAllProducts(): Promise<Product[]> {
    const db = await this.init();
    return db.getAll('products');
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const db = await this.init();
    return db.get('products', id);
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    const db = await this.init();
    return db.getFromIndex('products', 'by-barcode', barcode);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const db = await this.init();
    const allProducts = await db.getAll('products');
    
    const lowerQuery = query.toLowerCase();
    return allProducts.filter(
      p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.barcode?.toLowerCase().includes(lowerQuery)
    );
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<Product> {
    const db = await this.init();
    
    const newProduct: Product = {
      ...product,
      id: `local_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    await db.put('products', newProduct);
    
    await this.addPendingChange({
      type: 'create',
      entity: 'product',
      entityId: newProduct.id,
      data: newProduct,
      timestamp: Date.now(),
    });

    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const db = await this.init();
    const existing = await db.get('products', id);
    
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    await db.put('products', updated);
    
    await this.addPendingChange({
      type: 'update',
      entity: 'product',
      entityId: id,
      data: updates,
      timestamp: Date.now(),
    });

    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const db = await this.init();
    const existing = await db.get('products', id);
    
    if (!existing) return false;

    await db.delete('products', id);
    
    await this.addPendingChange({
      type: 'delete',
      entity: 'product',
      entityId: id,
      data: null,
      timestamp: Date.now(),
    });

    return true;
  }

  async bulkUpdateProducts(products: Product[]): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('products', 'readwrite');
    
    await Promise.all(
      products.map(product => tx.store.put({
        ...product,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      }))
    );
    
    await tx.done;
  }

  async clearAllProducts(): Promise<void> {
    const db = await this.init();
    await db.clear('products');
  }

  // ==================== SALE OPERATIONS ====================

  async createSale(
    items: { productId: string; quantity: number; unitPrice: number }[],
    userId: string
  ): Promise<{ sale: Sale; items: SaleItem[] }> {
    const db = await this.init();
    
    const saleId = `local_sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const sale: Sale = {
      id: saleId,
      totalAmount,
      saleDate: new Date().toISOString(),
      userId,
      syncStatus: 'pending',
    };

    // Save sale
    await db.put('sales', sale);

    // Save sale items and update product stock
    const saleItems: SaleItem[] = [];
    const tx = db.transaction(['saleItems', 'products'], 'readwrite');

    for (const item of items) {
      const product = await tx.objectStore('products').get(item.productId);
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Create sale item
      const saleItem: SaleItem = {
        id: `${saleId}_${item.productId}`,
        saleId,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      };

      await tx.objectStore('saleItems').put(saleItem);
      saleItems.push(saleItem);

      // Update product stock
      const updatedProduct = {
        ...product,
        stock: product.stock - item.quantity,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending' as const,
      };

      await tx.objectStore('products').put(updatedProduct);
    }

    await tx.done;

    // Add to pending changes
    await this.addPendingChange({
      type: 'sale',
      entity: 'sale',
      entityId: saleId,
      data: { sale, items },
      timestamp: Date.now(),
    });

    return { sale, items: saleItems };
  }

  async getAllSales(): Promise<Sale[]> {
    const db = await this.init();
    const sales = await db.getAll('sales');
    return sales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  }

  async getSale(id: string): Promise<Sale | undefined> {
    const db = await this.init();
    return db.get('sales', id);
  }

  async getSaleWithItems(saleId: string): Promise<{ sale: Sale; items: SaleItem[] } | null> {
    const db = await this.init();
    
    const sale = await db.get('sales', saleId);
    if (!sale) return null;

    const items = await db.getAllFromIndex('saleItems', 'by-sale', saleId);
    
    return { sale, items };
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    const db = await this.init();
    const allSales = await db.getAll('sales');
    
    return allSales.filter(sale => 
      sale.saleDate >= startDate && sale.saleDate <= endDate
    );
  }

  async bulkUpdateSales(sales: any[]): Promise<void> {
    const db = await this.init();
    const tx = db.transaction(['sales', 'saleItems'], 'readwrite');
    
    for (const saleData of sales) {
      const sale: Sale = {
        id: saleData.id,
        totalAmount: saleData.totalAmount,
        saleDate: saleData.saleDate,
        userId: saleData.userId,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      };

      await tx.objectStore('sales').put(sale);

      // Save sale items
      for (const item of saleData.items) {
        const saleItem: SaleItem = {
          id: `${saleData.id}_${item.productId}`,
          saleId: saleData.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        };

        await tx.objectStore('saleItems').put(saleItem);
      }
    }
    
    await tx.done;
  }

  // ==================== PENDING CHANGES ====================

  async addPendingChange(change: Omit<MyDB['pendingChanges']['value'], 'id'>): Promise<void> {
    const db = await this.init();
    await db.add('pendingChanges', change);
  }

  async getPendingChanges(): Promise<MyDB['pendingChanges']['value'][]> {
    const db = await this.init();
    return db.getAll('pendingChanges');
  }

  async clearPendingChange(id: number): Promise<void> {
    const db = await this.init();
    await db.delete('pendingChanges', id);
  }

  async clearAllPendingChanges(): Promise<void> {
    const db = await this.init();
    await db.clear('pendingChanges');
  }

  // ==================== SYNC OPERATIONS ====================

  async getUnsyncedProducts(): Promise<Product[]> {
    const db = await this.init();
    return db.getAllFromIndex('products', 'by-sync-status', 'pending');
  }

  async getUnsyncedSales(): Promise<Sale[]> {
    const db = await this.init();
    return db.getAllFromIndex('sales', 'by-sync-status', 'pending');
  }

  async markProductAsSynced(id: string): Promise<void> {
    const db = await this.init();
    const product = await db.get('products', id);
    
    if (product) {
      await db.put('products', {
        ...product,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      });
    }
  }

  async markSaleAsSynced(id: string): Promise<void> {
    const db = await this.init();
    const sale = await db.get('sales', id);
    
    if (sale) {
      await db.put('sales', {
        ...sale,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      });
    }
  }

  async markAsError(entity: 'product' | 'sale', id: string): Promise<void> {
    const db = await this.init();
    
    if (entity === 'product') {
      const product = await db.get('products', id);
      if (product) {
        await db.put('products', { ...product, syncStatus: 'error' });
      }
    } else {
      const sale = await db.get('sales', id);
      if (sale) {
        await db.put('sales', { ...sale, syncStatus: 'error' });
      }
    }
  }

  // ==================== STATISTICS ====================

  async getTodaySalesTotal(): Promise<number> {
    const db = await this.init();
    const today = new Date().toISOString().split('T')[0];
    const sales = await db.getAll('sales');
    
    const todaySales = sales.filter(sale => 
      sale.saleDate.startsWith(today)
    );
    
    return todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }

  async getTodaySalesCount(): Promise<number> {
    const db = await this.init();
    const today = new Date().toISOString().split('T')[0];
    const sales = await db.getAll('sales');
    
    return sales.filter(sale => sale.saleDate.startsWith(today)).length;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const db = await this.init();
    const products = await db.getAll('products');
    
    return products.filter(p => p.stock <= p.minStock);
  }
}

export const warungDB = new WarungDB();
export type { Product, Sale, SaleItem };