"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  User,
  LogOut,
  Search,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [bestSelling, setBestSelling] = useState<{ name: string; total_sold: number }[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Contoh data revenue & sales chart
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const bestRes = await fetch("/api/best-selling");
        setBestSelling(await bestRes.json());

        const salesRes = await fetch("/api/sales-detail");
        const sales = await salesRes.json();
        setRecentSales(sales);

        // Buat chart dummy dari recent sales
        const monthMap: Record<string, number> = {};
        const monthLabels: string[] = [];
        sales.forEach((s: any) => {
          const m = new Date(s.created_at).toLocaleString("default", { month: "short" });
          if (!monthMap[m]) monthMap[m] = 0;
          monthMap[m] += parseFloat(s.total_amount);
        });
        for (let key in monthMap) monthLabels.push(key);
        setMonths(monthLabels);
        setRevenueData(Object.values(monthMap));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const barChartData = {
    labels: bestSelling.map(p => p.name),
    datasets: [
      {
        label: "Terjual",
        data: bestSelling.map(p => p.total_sold),
        backgroundColor: "#374151",
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#1f2937",
        backgroundColor: "rgba(31, 41, 55, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#1f2937",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const menuItems = [
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Produk", icon: Package, href: "/product" },
    { name: "Penjualan", icon: ShoppingCart, href: "/penjualan" },
    { name: "Laporan", icon: BarChart2, href: "/laporan" },
    { name: "Pengaturan", icon: Settings, href: "/pengaturan" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - Minimalist & Professional */}
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
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Ringkasan performa bisnis Anda</p>
          </div>

          {/* STATS CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Transaksi",
                value: "1,234",
                icon: ShoppingCart,
                color: "from-gray-900 to-gray-900",
              },
              {
                title: "Produk Terjual",
                value: "567",
                icon: Package,
                color: "from-gray-900 to-gray-900",
              },
              {
                title: "Total Customer",
                value: "89",
                icon: Users,
                color: "from-gray-900 to-gray-900",
              },
              {
                title: "Pendapatan",
                value: "Rp 120jt",
                icon: TrendingUp,
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
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Revenue Bulanan</h2>
                  <p className="text-sm text-gray-500 mt-1">Grafik pendapatan per bulan</p>
                </div>
              </div>
              <Line 
                data={lineChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Produk Terlaris</h2>
                  <p className="text-sm text-gray-500 mt-1">Top produk dengan penjualan tertinggi</p>
                </div>
              </div>
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* RECENT SALES TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h2>
              <p className="text-sm text-gray-500 mt-1">Daftar transaksi penjualan terkini</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Kasir
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentSales.length > 0 ? (
                    recentSales.map((sale, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {sale.invoice_code}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{sale.cashier}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {sale.customer || "-"}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                          Rp {Number(sale.total_amount).toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(sale.created_at).toLocaleDateString("id-ID", {
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
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                        Tidak ada data transaksi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}