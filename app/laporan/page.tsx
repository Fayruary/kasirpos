"use client";

import { useEffect, useState } from "react";
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
  FileText,
  Download,
  Calendar,
  DollarSign,
  Box,
  Lock,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Sale {
  id: number;
  invoice_code: string;
  cashier: string;
  customer: string | null;
  total_amount: number;
  created_at: string;
}

interface BestSelling {
  name: string;
  total_sold: number;
  price: number;
  revenue: number;
  category: string;
}

interface StockHistory {
  id: number;
  product_name: string;
  type: "in" | "out";
  quantity: number;
  note: string;
  created_at: string;
}

interface CashierClose {
  id: number;
  cashier_name: string;
  opening_balance: number;
  closing_balance: number;
  total_sales: number;
  total_transactions: number;
  created_at: string;
}

type ReportType = "penjualan" | "produk" | "stok" | "kasir";

export default function LaporanPage() {
  const [activeMenu, setActiveMenu] = useState("Laporan");
  const [activeReport, setActiveReport] = useState<ReportType>("penjualan");
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [sales, setSales] = useState<Sale[]>([]);
  const [bestSelling, setBestSelling] = useState<BestSelling[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [cashierClose, setCashierClose] = useState<CashierClose[]>([]);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("7days");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReportData();
  }, [activeReport, dateFilter]);

  async function fetchReportData() {
    try {
      setIsLoading(true);
      
      if (activeReport === "penjualan") {
        const res = await fetch("/api/sales-detail");
        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
      }
      
      if (activeReport === "produk") {
        const res = await fetch("/api/best-selling");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Add mock price and revenue
          const formatted: BestSelling[] = data.map((item: any) => ({
            name: item.name,
            total_sold: item.total_sold,
            price: Math.floor(Math.random() * 500000) + 50000, // Mock price
            revenue: item.total_sold * (Math.floor(Math.random() * 500000) + 50000),
            category: "Electronics", // Mock category
          }));
          setBestSelling(formatted);
        }
      }
      
      if (activeReport === "stok") {
        // Mock stock history data
        const mockStockHistory: StockHistory[] = [
          { id: 1, product_name: "Product A", type: "in", quantity: 100, note: "Pembelian supplier", created_at: new Date().toISOString() },
          { id: 2, product_name: "Product B", type: "out", quantity: 50, note: "Penjualan", created_at: new Date().toISOString() },
          { id: 3, product_name: "Product C", type: "in", quantity: 75, note: "Restock", created_at: new Date().toISOString() },
          { id: 4, product_name: "Product A", type: "out", quantity: 30, note: "Penjualan", created_at: new Date().toISOString() },
          { id: 5, product_name: "Product D", type: "in", quantity: 200, note: "Pembelian supplier", created_at: new Date().toISOString() },
        ];
        setStockHistory(mockStockHistory);
      }
      
      if (activeReport === "kasir") {
        // Mock cashier close data
        const mockCashierClose: CashierClose[] = [
          { id: 1, cashier_name: "Admin", opening_balance: 1000000, closing_balance: 5500000, total_sales: 4500000, total_transactions: 45, created_at: new Date().toISOString() },
          { id: 2, cashier_name: "Kasir 1", opening_balance: 1000000, closing_balance: 3200000, total_sales: 2200000, total_transactions: 28, created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, cashier_name: "Kasir 2", opening_balance: 1000000, closing_balance: 4800000, total_sales: 3800000, total_transactions: 52, created_at: new Date(Date.now() - 172800000).toISOString() },
        ];
        setCashierClose(mockCashierClose);
      }
      
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const menuItems = [
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Produk", icon: Package, href: "/product" },
    { name: "Penjualan", icon: ShoppingCart, href: "/penjualan" },
    { name: "Laporan", icon: BarChart2, href: "/laporan" },
    { name: "Pengaturan", icon: Settings, href: "/pengaturan" },
  ];

  const reportTabs = [
    { id: "penjualan", label: "Riwayat Penjualan", icon: ShoppingCart },
    { id: "produk", label: "Produk Terlaris", icon: TrendingUp },
    { id: "stok", label: "Riwayat Stok", icon: Box },
    { id: "kasir", label: "Tutup Kasir", icon: Lock },
  ];

  // Filter data based on search
  const filteredSales = sales.filter(sale => 
    sale.invoice_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sale.customer && sale.customer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProducts = bestSelling.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStock = stockHistory.filter(stock =>
    stock.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCashier = cashierClose.filter(cashier =>
    cashier.cashier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data for best selling products
  const chartData = {
    labels: bestSelling.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: "Terjual",
        data: bestSelling.slice(0, 5).map(p => p.total_sold),
        backgroundColor: "#374151",
        borderRadius: 8,
      },
    ],
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
              <p className="text-sm text-gray-500 mt-1">Analisis dan riwayat data bisnis</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
          </div>

          {/* Report Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex overflow-x-auto">
                {reportTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveReport(tab.id as ReportType)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeReport === tab.id
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

            {/* Filter & Search */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  {["7days", "30days", "90days"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setDateFilter(period)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                        dateFilter === period
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {period === "7days" ? "7 Hari" : period === "30days" ? "30 Hari" : "90 Hari"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-gray-500">Memuat data laporan...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* RIWAYAT PENJUALAN */}
                  {activeReport === "penjualan" && (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
                          <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
                          <p className="text-2xl font-bold text-gray-900">
                            Rp {(filteredSales.reduce((sum, s) => sum + Number(s.total_amount), 0) / 1000000).toFixed(1)}jt
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Rata-rata Transaksi</p>
                          <p className="text-2xl font-bold text-gray-900">
                            Rp {(filteredSales.reduce((sum, s) => sum + Number(s.total_amount), 0) / filteredSales.length / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Kasir</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredSales.length > 0 ? (
                              filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{sale.invoice_code}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{sale.cashier}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{sale.customer || "-"}</td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    Rp {Number(sale.total_amount).toLocaleString("id-ID")}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-500">
                                    {new Date(sale.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                                  Tidak ada data penjualan
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* PRODUK TERLARIS */}
                  {activeReport === "produk" && (
                    <div className="space-y-6">
                      {/* Chart */}
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 5 Produk Terlaris</h3>
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: {
                              y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                              x: { grid: { display: false } },
                            },
                          }}
                        />
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Ranking</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Produk</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Terjual</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Revenue</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length > 0 ? (
                              filteredProducts.map((product, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="py-3 px-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                                      {idx + 1}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">{product.name}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                      {product.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    Rp {product.price.toLocaleString("id-ID")}
                                  </td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    {product.total_sold} unit
                                  </td>
                                  <td className="py-3 px-4 text-sm font-bold text-gray-900">
                                    Rp {product.revenue.toLocaleString("id-ID")}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                                  Tidak ada data produk
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* RIWAYAT STOK */}
                  {activeReport === "stok" && (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Pergerakan</p>
                          <p className="text-2xl font-bold text-gray-900">{filteredStock.length}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Stok Masuk</p>
                          <p className="text-2xl font-bold text-green-600">
                            +{filteredStock.filter(s => s.type === "in").reduce((sum, s) => sum + s.quantity, 0)}
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Stok Keluar</p>
                          <p className="text-2xl font-bold text-red-600">
                            -{filteredStock.filter(s => s.type === "out").reduce((sum, s) => sum + s.quantity, 0)}
                          </p>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Produk</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Tipe</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Keterangan</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredStock.length > 0 ? (
                              filteredStock.map((stock) => (
                                <tr key={stock.id} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{stock.product_name}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                                        stock.type === "in"
                                          ? "bg-green-50 text-green-700"
                                          : "bg-red-50 text-red-700"
                                      }`}
                                    >
                                      {stock.type === "in" ? "Masuk" : "Keluar"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    {stock.type === "in" ? "+" : "-"}{stock.quantity}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{stock.note}</td>
                                  <td className="py-3 px-4 text-sm text-gray-500">
                                    {new Date(stock.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                                  Tidak ada riwayat stok
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TUTUP KASIR */}
                  {activeReport === "kasir" && (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Tutup Kasir</p>
                          <p className="text-2xl font-bold text-gray-900">{filteredCashier.length}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Penjualan</p>
                          <p className="text-2xl font-bold text-gray-900">
                            Rp {(filteredCashier.reduce((sum, c) => sum + c.total_sales, 0) / 1000000).toFixed(1)}jt
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {filteredCashier.reduce((sum, c) => sum + c.total_transactions, 0)}
                          </p>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Kasir</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Modal Awal</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Modal Akhir</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Penjualan</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Transaksi</th>
                              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredCashier.length > 0 ? (
                              filteredCashier.map((cashier) => (
                                <tr key={cashier.id} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{cashier.cashier_name}</td>
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    Rp {cashier.opening_balance.toLocaleString("id-ID")}
                                  </td>
                                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    Rp {cashier.closing_balance.toLocaleString("id-ID")}
                                  </td>
                                  <td className="py-3 px-4 text-sm font-bold text-green-600">
                                    Rp {cashier.total_sales.toLocaleString("id-ID")}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    {cashier.total_transactions} transaksi
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-500">
                                    {new Date(cashier.created_at).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                                  Tidak ada data tutup kasir
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}