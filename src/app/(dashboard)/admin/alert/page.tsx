"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/app/(dashboard)/_components/dashboard-layout";
import { AlertCards } from "@/src/app/(dashboard)/admin/alert/components/alert-card";
import { CardData } from "@/src/app/(dashboard)/admin/alert/components/card-data";
import { AlertResponse } from "@/src/app/(dashboard)/admin/alert/types";

export default function AdminWarungAlert() {
  const [data, setData] = useState<AlertResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAlertData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/alert");

        if (!response.ok) {
          throw new Error("Gagal memuat data alert.");
        }

        const payload = (await response.json()) as AlertResponse;

        if (isMounted) {
          setData(payload);
        }
      } catch (err) {
        console.error("Fetch Alert Error:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat data alert."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAlertData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {error && (
            <div className="mx-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700 lg:mx-6">
              {error}
            </div>
          )}
          <AlertCards summary={data?.summary} isLoading={isLoading} />
          <div className="pt-2 lg:pt-2">
            <CardData products={data?.products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}