
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
  Calendar,
  Download,
  TrendingDown,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
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

interface ProductSale {
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "custom";
type SortType = "terlaris" | "kurang-laku";

export default function PenjualanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [activeMenu, setActiveMenu] = useState("Penjualan");
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
const [products, setProducts] = useState<any[]>([]);
const [showTransaction, setShowTransaction] = useState(false);
const [paidAmount, setPaidAmount] = useState(0);

async function handleCheckout() {
  if (cart.length === 0) {
    return alert("Keranjang kosong");
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (paidAmount < total) {
    return alert("Uang tidak cukup");
  }

  const response = await fetch("/api/transaksi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      branch_id: 1,
      shift_id: 1,
      user_id: 2,
      customer_id: 1,
      payment_method: "cash",
      paid_amount: paidAmount,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }),
  });

  const data = await response.json();

  if (data.success) {
    alert("Transaksi berhasil! " + data.invoice_code);
    setCart([]);
    setPaidAmount(0);
    setShowTransaction(false);
    fetchSalesData();
  } else {
    alert(data.error);
  }
}
  
  // Filter states
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [sortBy, setSortBy] = useState<SortType>("terlaris");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSalesData();
  }, [period, startDate, endDate]);

  async function fetchSalesData() {
    try {
      setIsLoading(true);
      
      // Fetch sales detail
      const salesRes = await fetch("/api/sales-detail");
      const salesData = await salesRes.json();
      
      if (Array.isArray(salesData)) {
        setSales(salesData);
        calculateProductSales(salesData);
      } else {
        setSales([]);
        setProductSales([]);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
      setProductSales([]);
    } finally {
      setIsLoading(false);
    }
  }

  function calculateProductSales(salesData: Sale[]) {
  fetch("/api/best-selling")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const formatted = data.map((item: any) => ({
          product_name: item.name,
          total_sold: Number(item.total_sold || 0),      // <- pastikan number
          total_revenue: Number(item.revenue || 0),      // <- pastikan number
        }));
        setProductSales(formatted);
      }
    })
    .catch(err => console.error("Error fetching best-selling:", err));
}


  // Filter sales by period
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at);
    const now = new Date();
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        sale.invoice_code.toLowerCase().includes(query) ||
        sale.cashier.toLowerCase().includes(query) ||
        (sale.customer && sale.customer.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Period filter
    if (period === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return saleDate >= start && saleDate <= end;
    }

    if (period === "daily") {
      return saleDate.toDateString() === now.toDateString();
    }

    if (period === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return saleDate >= weekAgo;
    }

    if (period === "monthly") {
      return saleDate.getMonth() === now.getMonth() && 
             saleDate.getFullYear() === now.getFullYear();
    }

    if (period === "yearly") {
      return saleDate.getFullYear() === now.getFullYear();
    }

    return true;
  });

  // Sort product sales
  const sortedProductSales = [...productSales].sort((a, b) => {
    if (sortBy === "terlaris") {
      return b.total_sold - a.total_sold;
    } else {
      return a.total_sold - b.total_sold;
    }
  });

  // Calculate statistics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalTransactions = filteredSales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Chart data
  const chartData = {
    labels: filteredSales.slice(0, 10).map(s => 
      new Date(s.created_at).toLocaleDateString("id-ID", { 
        day: "numeric", 
        month: "short" 
      })
    ),
    datasets: [
      {
        label: "Penjualan",
        data: filteredSales.slice(0, 10).map(s => Number(s.total_amount)),
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

  useEffect(() => {
  fetch("/api/product")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) setProducts(data);
    });
}, []);

function addToCart(product: any) {
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    setCart(cart.map(p =>
      p.id === product.id
        ? { ...p, quantity: p.quantity + 1 }
        : p
    ));
  } else {
    setCart([
      ...cart,
      {
        ...product,
        price: Number(product.price), // FIX DI SINI
        quantity: 1
      }
    ]);
  };
};

// Hapus produk dari cart
const removeFromCart = (productId: number) => {
  setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
};



console.log("Products state:", products);

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
          {/* Page Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Penjualan</h1>
              <p className="text-sm text-gray-500 mt-1">Analisis dan laporan penjualan</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
          </div>

          <button
  onClick={() => setShowTransaction(true)}
  className="px-4 py-2 bg-gray-900 text-white rounded-xl"
>
  + Transaksi Baru
</button>

{showTransaction && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-3xl p-6 rounded-2xl">
      <h2 className="text-lg font-bold mb-4">Transaksi Baru</h2>

      {/* LIST PRODUK DENGAN KATEGORI */}
      <div className="mb-4 max-h-64 overflow-auto">
  <div className="grid grid-cols-3 gap-3">
    {products.map((product) => (
      <button
        key={product.id}
        onClick={() => addToCart(product)}
        className="p-3 border rounded-lg hover:bg-gray-50 text-sm flex flex-col"
      >
        <span>{product.name}</span>
        <span className="text-xs text-gray-500">
          Rp {Number(product.price).toLocaleString("id-ID")}
        </span>
      </button>
    ))}
  </div>
</div>

      {/* CART */}
      <div className="space-y-2 mb-4 border-t pt-2 max-h-40 overflow-auto">
        {cart.length === 0 ? (
          <div className="text-gray-400 text-sm">Belum ada produk di keranjang</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>
                {item.name} x{item.quantity}
              </span>
              <div className="flex gap-2 items-center">
                <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}
      <div className="mb-4 font-semibold">
        Total: Rp{" "}
        {cart
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toLocaleString("id-ID")}
      </div>

      {/* INPUT BAYAR */}
      <input
  type="number"
  placeholder="Uang dibayar"
  value={paidAmount === 0 ? "" : paidAmount}
  onChange={(e) => setPaidAmount(e.target.value === "" ? 0 : Number(e.target.value))}
  className="w-full border px-3 py-2 rounded-lg mb-4"
/>

      {/* KEMBALIAN */}
      {paidAmount > 0 && (
        <div className="mb-4 text-sm">
          Kembalian: Rp{" "}
          {(paidAmount -
            cart.reduce((sum, item) => sum + item.price * item.quantity, 0) >
          0
            ? paidAmount -
              cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            : 0
          ).toLocaleString("id-ID")}
        </div>
      )}

      {/* BUTTON */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            // RESET SEMUA STATE
            setCart([]);
            setPaidAmount(0);
            setShowTransaction(false);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Batal
        </button>
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Bayar
        </button>
      </div>
    </div>
  </div>
)}

          {/* STATS CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
  title: "Total Pendapatann",
  value: `Rp ${filteredSales.reduce((sum, s) => sum + Number(s.total_amount), 0).toLocaleString("id-ID")}`,
  icon: TrendingUp,
  color: "from-gray-900 to-gray-900",
},
              {
  title: "Total Transaksi",
  value: filteredSales.length.toString(),
  icon: ShoppingCart,
  color: "from-gray-900 to-gray-900",
},

             {
  title: "Rata-rata Transaksi",
  value: `Rp ${(
    filteredSales.reduce((sum, s) => sum + Number(s.total_amount), 0) /
    (filteredSales.length || 1)
  ).toLocaleString("id-ID")}`,
  icon: BarChart2,
  color: "from-gray-900 to-gray-900",
},
           {
  title: "Produk Terjual",
  value: productSales.reduce((sum, p) => sum + Number(p.total_sold || 0), 0).toString(),
  icon: Package,
  color: "from-gray-900 to-gray-900",
}
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

          {/* FILTERS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Period Filter */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                  Periode
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "daily", label: "Harian" },
                    { value: "weekly", label: "Mingguan" },
                    { value: "monthly", label: "Bulanan" },
                    { value: "yearly", label: "Tahunan" },
                    { value: "custom", label: "Custom" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPeriod(p.value as PeriodType)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        period === p.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              {period === "custom" && (
                <div className="flex gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                      Dari
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                      Sampai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CHART & TOP PRODUCTS */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Tren Penjualan</h2>
                <p className="text-sm text-gray-500 mt-1">Grafik penjualan periode terpilih</p>
              </div>
              <Line
                data={chartData}
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
                        color: "#f3f4f6",
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

            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Produk Terlaris</h2>
                  <p className="text-sm text-gray-500 mt-1">Berdasarkan jumlah terjual</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("terlaris")}
                    className={`p-2 rounded-lg transition-all ${
                      sortBy === "terlaris"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Terlaris"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSortBy("kurang-laku")}
                    className={`p-2 rounded-lg transition-all ${
                      sortBy === "kurang-laku"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Kurang Laku"
                  >
                    <TrendingDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {sortedProductSales.slice(0, 5).map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {product.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.total_sold} terjual
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      Rp {(product.total_revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari invoice, kasir, atau customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* SALES TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Daftar Transaksi</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredSales.length} transaksi ditemukan
              </p>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3"></div>
                          <p className="text-sm text-gray-500">Memuat data penjualan...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {sale.invoice_code}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {sale.cashier}
                        </td>
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
                      <td colSpan={5} className="py-12 text-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900">
                          Tidak ada transaksi
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Belum ada data penjualan untuk periode ini
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && filteredSales.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan {filteredSales.length} transaksi
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
