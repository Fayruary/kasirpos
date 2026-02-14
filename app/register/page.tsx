"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: "name" | "storeName" | "email" | "password") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register Data:", formData);
    // nanti sambungkan ke backend / API
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>

      {/* Soft Blur Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-400 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* Form Card */}
      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Daftarkan toko kamu dan mulai kelola penjualan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            {/* Nama Toko */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Toko
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={handleChange("storeName")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  placeholder="Contoh: Toko Sumber Rejeki"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  placeholder="Minimal 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Daftar Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Masuk disini
            </Link>
          </p>

          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors block"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
