"use client";

import { useState, useMemo } from "react";
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

const initialData: MyFormData[] = [
   {
    id: "1",
    name_4603829743: "Indomie Goreng",
    name_0878515932: "Rp 3.500",
    name_0706064476: 20,
    name_6646786819: 86010424,
    
  },
  {
    id: "2",
    name_4603829743: "Lee Mineral 330ml",
    name_0878515932: "Rp 3.500",
    name_0706064476: 30,
    name_6646786819: 86010424,
  },
  
];

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>(initialData);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
const columns = createColumns();

  const handleCreate = (newRecord: Omit<MyFormData, "id">) => {
    const record = { ...newRecord, id: String(data.length + 1) };
    setData([...data, record]);
    setIsDialogOpen(false);
  };

  const handleUpdate = (updatedUser: MyFormData) => {
    setData(data.map((record) => (record.id === updatedUser.id ? updatedUser : record)));
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    setData(data.filter((record) => record.id !== id));
  };

  const handleEdit = (record: MyFormData) => {
    setEditingUser(record);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };
  return (
    <DashboardLayout>
      <div className="p-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit" : "Create New"}</DialogTitle>
              <DialogDescription>
                Please fill out the form below to {editingUser ? "update the data" : "create a new data"}.
              </DialogDescription>
            </DialogHeader>
            <div>
              <UserForm
                initialData={editingUser}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
              />
            </div>
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