"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { MyFormData } from "./table";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 350 } },
        (decodedText) => {
          onScan(decodedText);
          // Hentikan scanner hanya jika sedang running
          if (isRunningRef.current) {
            scanner.stop().catch(() => {});
            isRunningRef.current = false;
          }
        },
        () => {}
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => console.error(err));

    return () => {
      if (isRunningRef.current) {
        scanner.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, []);

  return null;
}

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
    name_6646786819: "",
    name_6646786821: 10,
  });

  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name_4603829743: initialData.name_4603829743,
        name_0878515932: initialData.name_0878515932,
        name_0706064476: initialData.name_0706064476,
        name_6646786819: initialData.name_6646786819,
        name_6646786821: initialData.name_6646786821 ?? 10,
      });
    } else {
      setFormData({
        name_4603829743: "",
        name_0878515932: "",
        name_0706064476: 0,
        name_6646786819: "",
        name_6646786821: 10,
      });
    }
  }, [initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
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
    <>
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow w-[320px]">
            <p className="font-semibold mb-3 text-center">Scan Barcode</p>

            <div id="reader" className="w-full h-[240px] rounded overflow-hidden" />

            <Button
              className="w-full mt-3"
              variant="destructive"
              onClick={() => setShowScanner(false)}
            >
              Tutup
            </Button>
          </div>

          {/* Jalankan scanner */}
          <BarcodeScanner
            onScan={(code) => {
              // Update state sehingga input barcode langsung terisi
              setFormData((prev) => ({
                ...prev,
                name_6646786819: code,
              }));
              setShowScanner(false);
            }}
          />
        </div>
      )}

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
          <div className="flex gap-2">
            <Input
              type="text"
              name="name_6646786819"
              value={formData.name_6646786819} // ← langsung ter-update dari scan
              onChange={handleChange}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={() => setShowScanner(true)}>
              Scan
            </Button>
          </div>
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
    </>
  );
}
