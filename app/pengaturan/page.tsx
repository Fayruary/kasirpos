"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  BarChart2,
  LogOut,
  Search,
  Bell,
  Settings,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

export default function PengaturanPage() {
  const [activeMenu, setActiveMenu] = useState("Pengaturan");
  const [activeTab, setActiveTab] = useState<"profil" | "notifikasi" | "password">("profil");
  
  // Profile states
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@kasirpos.com",
    phone: "08123456789",
    address: "Jakarta, Indonesia",
    role: "Super Admin",
  });
  
  // Notification states
  const [notifications, setNotifications] = useState({
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
    salesNotif: true,
    stockNotif: true,
    reportNotif: false,
  });
  
  // Password states
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Produk", icon: Package, href: "/product" },
    { name: "Penjualan", icon: ShoppingCart, href: "/penjualan" },
    { name: "Laporan", icon: BarChart2, href: "/laporan" },
    { name: "Pengaturan", icon: Settings, href: "/pengaturan" },
  ];

  const handleProfileUpdate = () => {
    // Simulate API call
    setSaveMessage("Profil berhasil diperbarui!");
    setErrorMessage("");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationUpdate = () => {
    setSaveMessage("Pengaturan notifikasi berhasil diperbarui!");
    setErrorMessage("");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordChange = async () => {
  if (!passwords.current || !passwords.new || !passwords.confirm) {
    setErrorMessage("Semua field harus diisi!");
    setSaveMessage("");
    return;
  }

  if (passwords.new !== passwords.confirm) {
    setErrorMessage("Kata sandi baru tidak cocok!");
    setSaveMessage("");
    return;
  }

  if (passwords.new.length < 6) {
    setErrorMessage("Kata sandi minimal 6 karakter!");
    setSaveMessage("");
    return;
  }

  try {
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1, // ganti dengan user ID dari session/login
        currentPassword: passwords.current,
        newPassword: passwords.new,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.error || "Terjadi kesalahan");
      setSaveMessage("");
      return;
    }

    setSaveMessage(data.message);
    setErrorMessage("");
    setPasswords({ current: "", new: "", confirm: "" });
    setTimeout(() => setSaveMessage(""), 3000);
  } catch (error) {
    setErrorMessage("Terjadi kesalahan jaringan");
    setSaveMessage("");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">KasirPOS</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard Admin</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  activeMenu === item.name
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {activeMenu === item.name && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@kasirpos.com</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk, invoice, customer..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 space-y-6 overflow-auto">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola profil dan preferensi akun Anda</p>
          </div>

          {/* Success/Error Messages */}
          {saveMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">{saveMessage}</p>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-900">{errorMessage}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex">
                {[
                  { id: "profil", label: "Profil", icon: User },
                  { id: "notifikasi", label: "Notifikasi", icon: Bell },
                  { id: "password", label: "Ubah Kata Sandi", icon: Lock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {/* PROFIL TAB */}
              {activeTab === "profil" && (
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-3xl font-bold">
                        A
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-500">{profile.role}</p>
                      <button className="mt-2 text-sm font-medium text-gray-900 hover:underline">
                        Ubah Foto Profil
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Alamat
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileUpdate}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFIKASI TAB */}
              {activeTab === "notifikasi" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Preferensi Notifikasi
                    </h3>
                    <p className="text-sm text-gray-500">
                      Pilih bagaimana Anda ingin menerima notifikasi
                    </p>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Saluran Notifikasi
                      </h4>
                      <div className="space-y-3">
                        {[
                          { key: "emailNotif", label: "Email", desc: "Terima notifikasi melalui email" },
                          { key: "smsNotif", label: "SMS", desc: "Terima notifikasi melalui SMS" },
                          { key: "pushNotif", label: "Push Notification", desc: "Terima notifikasi push di browser" },
                        ].map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={(e) =>
                                  setNotifications({
                                    ...notifications,
                                    [item.key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 transition-all"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Jenis Notifikasi
                      </h4>
                      <div className="space-y-3">
                        {[
                          { key: "salesNotif", label: "Transaksi Penjualan", desc: "Notifikasi setiap ada penjualan baru" },
                          { key: "stockNotif", label: "Stok Produk", desc: "Peringatan saat stok produk menipis" },
                          { key: "reportNotif", label: "Laporan Harian", desc: "Ringkasan penjualan harian" },
                        ].map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={(e) =>
                                  setNotifications({
                                    ...notifications,
                                    [item.key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 transition-all"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNotificationUpdate}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD TAB */}
              {activeTab === "password" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Ubah Kata Sandi
                    </h3>
                    <p className="text-sm text-gray-500">
                      Pastikan kata sandi Anda kuat dan aman
                    </p>
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Kata Sandi Saat Ini
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword.current ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="Masukkan kata sandi saat ini"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword.new ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="Masukkan kata sandi baru"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="Konfirmasi kata sandi baru"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Tips Keamanan Kata Sandi
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• Gunakan minimal 6 karakter</li>
                      <li>• Kombinasikan huruf besar, huruf kecil, angka, dan simbol</li>
                      <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
                      <li>• Ubah kata sandi secara berkala</li>
                    </ul>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handlePasswordChange}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}