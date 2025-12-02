"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        name,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Signup failed");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="px-10 py-12 relative">

          {/* BACK BUTTON */}
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 text-green-700 hover:text-green-900 hover:bg-green-50 px-3"
          >
            ← Kembali
          </Button>

          {/* Logo */}
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6 mt-4">
            <span className="text-green-700 font-semibold text-xl">P</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
          <p className="text-gray-600 mt-2">
            Daftar untuk mulai mengelola transaksi dan inventaris toko Anda.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* NAME */}
            <div className="space-y-2">
              <Label className="text-gray-700">Nama</Label>
              <Input
                type="text"
                placeholder="Toko Makmur"
                className="bg-gray-100 border-gray-200 text-gray-900 focus:ring-green-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input
                type="email"
                placeholder="tokomakmur@example.com"
                className="bg-gray-100 border-gray-200 text-gray-900 focus:ring-green-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label className="text-gray-700">Kata Sandi</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-gray-100 border-gray-200 text-gray-900 focus:ring-green-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* CONFIRM */}
            <div className="space-y-2">
              <Label className="text-gray-700">Konfirmasi Kata Sandi</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-gray-100 border-gray-200 text-gray-900 focus:ring-green-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-md shadow-md"
            >
              {loading ? "Membuat Akun..." : "Daftar"}
            </Button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-sm text-gray-700 text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-green-700 hover:underline">
              Masuk
            </Link>
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-br from-green-600 to-green-700 text-white relative">

          {/* Background Illustration */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://cdn-icons-png.flaticon.com/512/891/891462.png')] bg-cover blur-2xl"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-4">
              Sistem POS Mudah Digunakan
            </h3>
            <p className="text-white/80 text-[15px] leading-relaxed">
              Kelola transaksi, stok barang, pelanggan, dan laporan keuangan —
              semua dalam satu dashboard yang cepat dan efisien.
            </p>

            <div className="flex gap-6 mt-10 opacity-90">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                🧾
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                📦
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                🛍️
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
