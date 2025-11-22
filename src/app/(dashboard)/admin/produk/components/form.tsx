"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { MyFormData } from "./table";

interface UserFormProps {
  initialData?: MyFormData | null;
  onCreate?: (data: Omit<MyFormData, "id">) => void;
  onUpdate?: (data: MyFormData) => void;
}

export function UserForm({ initialData, onCreate, onUpdate }: UserFormProps) {
  const [formData, setFormData] = useState({
    name_4603829743: "",
    name_0878515932: "",
    name_0706064476: 0,
    name_6646786819: 0,
    name_6646786821: 10,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name_4603829743: initialData.name_4603829743,
        name_0878515932: initialData.name_0878515932,
        name_0706064476: initialData.name_0706064476,
        name_6646786819: initialData.name_6646786819,
        name_6646786821: initialData.name_6646786821 ?? 10,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData && onUpdate) {
      onUpdate({ ...formData, id: initialData.id });
    } else if (onCreate) {
      onCreate(formData);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Nama Produk</Label>
        <Input
          name="name_4603829743"
          value={formData.name_4603829743}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Harga</Label>
        <Input
          name="name_0878515932"
          value={formData.name_0878515932}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Stok</Label>
        <Input
          type="number"
          name="name_0706064476"
          value={formData.name_0706064476}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Barcode</Label>
        <Input
          type="number"
          name="name_6646786819"
          value={formData.name_6646786819}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Min Stok</Label>
        <Input
          type="number"
          name="name_6646786821"
          value={formData.name_6646786821}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update" : "Create"}
      </Button>
    </form>
  );
}
