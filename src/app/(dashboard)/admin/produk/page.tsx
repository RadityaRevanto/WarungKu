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

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const columns = createColumns();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
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
    };

    if (mounted) {
      fetchProducts();
    }
  }, [mounted]);

  // ... rest of your handlers (handleCreate, handleUpdate, etc.)
  // [Gunakan kode yang sudah ada sebelumnya]

  const handleCreate = async (newRecord: Omit<MyFormData, "id">) => {
    try {
      const body = {
        name: newRecord.name_4603829743,
        price: Number(newRecord.name_0878515932),
        stock: newRecord.name_0706064476,
        barcode: String(newRecord.name_6646786819),
        minStock: newRecord.name_6646786821 ?? 10,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to create product");

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
    } catch (error) {
      console.error("Create product error:", error);
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