"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  LogOut,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  created_at: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState("Produk");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/product");
        const data = await response.json();
        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Data is not an array:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Produk", icon: Package, href: "/product" },
    { name: "Penjualan", icon: ShoppingCart, href: "/penjualan" },
    { name: "Laporan", icon: BarChart2, href: "/laporan" },
    { name: "Pengaturan", icon: Settings, href: "/pengaturan" },
  ];

  // Filter products based on search and category
  const filteredProducts = Array.isArray(products) ? products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "Semua" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(Array.isArray(products) ? products.map(p => p.category) : []))];

  // Hitung stats langsung dari products state
const totalProducts = products.length; // jumlah total produk
const totalStock = products.reduce((sum, p) => sum + p.stock, 0); // jumlah total stok semua produk
const lowStock = products.filter(p => p.stock < 10).length; // jumlah produk dengan stok < 10
const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0); // total nilai inventori

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - Same as Dashboard */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">KasirPOS</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard Admin</p>
        </div>

        {/* Navigation */}
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

        {/* User Section */}
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
          {/* Page Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola semua produk di toko Anda</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm">
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {[
    {
      title: "Total Produk",
      value: totalProducts.toString(),
      icon: Package,
      color: "from-gray-900 to-gray-900",
    },
    {
      title: "Total Stok",
      value: totalStock.toString(),
      icon: TrendingUp,
      color: "from-gray-900 to-gray-900",
    },
    {
      title: "Stok Menipis",
      value: lowStock.toString(),
      icon: Package,
      color: "from-gray-900 to-gray-900",
      alert: lowStock > 0,
    },
    {
      title: "Nilai Inventori",
      value: `Rp ${(totalValue / 1000000).toFixed(1)}jt`,
      icon: BarChart2,
      color: "from-gray-900 to-gray-900",
    },
  ].map((stat, idx) => (
    <div
      key={idx}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          {stat.alert && <p className="text-xs text-red-600 mt-1">Perlu restock!</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  ))}
</div>

          {/* FILTER & SEARCH BAR */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama produk atau SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-11 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm appearance-none bg-white cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Produk
                    </th>
                  <th className="py-3 pl-8 pr-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
  SKU
</th>
<th className="py-3 pl-8 pr-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
  Kategori
</th>
<th className="py-3 pl-8 pr-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
  Harga
</th>
<th className="py-3 pl-9 pr-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
  Stok
</th>
<th className="py-3 pl-8 pr-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
  Aksi
</th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3"></div>
                          <p className="text-sm text-gray-500">Memuat data produk...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                          {product.sku}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                          Rp {product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                              product.stock < 10
                                ? "bg-red-50 text-red-700"
                                : product.stock < 50
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {product.stock} unit
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900">Produk tidak ditemukan</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan {filteredProducts.length} dari {totalProducts} produk
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                    2
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}