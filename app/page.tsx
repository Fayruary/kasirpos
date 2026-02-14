"use client";

import LandingPage from "@/components/landingpage/index";
import {
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Cpu,
  Users,
  LifeBuoy,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <LandingPage>
      {/* HERO - Enhanced dengan gradient dan lebih engaging */}
     <section className="relative pt-16 pb-20 md:pb-32 md:pt-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-6"
        >
          <Zap className="w-4 h-4" />
          <span>Trusted by 10,000+ Bisnis di Indonesia</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight text-black max-w-5xl"
        >
          Sistem Kasir Terbaik untuk{" "}
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Bisnis Modern
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed"
        >
          Tingkatkan efisiensi bisnis dengan sistem POS all-in-one. Kelola
          transaksi, inventori, dan laporan dalam satu platform yang mudah
          digunakan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex gap-4 flex-wrap justify-center"
        >
          <button className="group px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
            Mulai Gratis 14 Hari
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all font-semibold">
            Lihat Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex items-center gap-6 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Tanpa Kartu Kredit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Setup 5 Menit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION - Tambahan untuk kredibilitas */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 md:px-8">
          {[
            { number: "10K+", label: "Bisnis Aktif" },
            { number: "1M+", label: "Transaksi/Bulan" },
            { number: "99.9%", label: "Uptime" },
            { number: "4.9/5", label: "Rating Pengguna" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
              <div className="text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

   {/* FEATURES - Background Hitam, Icon Abu-Abu */}
<section id="features" className="py-20 md:py-28 bg-gray-900">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Fitur Unggulan
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        Semua yang Anda butuhkan untuk menjalankan bisnis dengan lebih efisien
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6">
      {[
        {
          icon: Zap,
          title: "Transaksi Lightning",
          desc: "Proses checkout dalam hitungan detik dengan interface intuitif dan responsif.",
        },
        {
          icon: TrendingUp,
          title: "Analytics Real-Time",
          desc: "Dashboard lengkap dengan insight mendalam untuk keputusan bisnis yang lebih baik.",
        },
        {
          icon: ShieldCheck,
          title: "Keamanan Enterprise",
          desc: "Enkripsi end-to-end dan backup otomatis untuk melindungi data bisnis Anda.",
        },
      ].map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-gray-600"
          >
            <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
            <p className="text-gray-300 leading-relaxed">{item.desc}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>

      {/* WHY CHOOSE US - Enhanced */}
      <section id="why-choose-us" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Kenapa KasirPOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform terlengkap yang dirancang khusus untuk bisnis Indonesia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: "Integrasi Hardware",
                desc: "Compatible dengan printer thermal, barcode scanner, cash drawer, dan semua perangkat POS modern.",
              },
              {
                icon: Users,
                title: "Multi-User & Role",
                desc: "Kelola tim dengan sistem permission yang fleksibel. Track aktivitas setiap staff dengan mudah.",
              },
              {
                icon: LifeBuoy,
                title: "Support Responsif",
                desc: "Tim support berbahasa Indonesia siap membantu via chat, email, dan telepon 24/7.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Enhanced dengan rating stars */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Dipercaya Ribuan Bisnis
            </h2>
            <p className="text-xl text-gray-600">
              Dengar langsung dari para pemilik bisnis yang telah berkembang
              bersama kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rina Setiawan",
                role: "Pemilik Kafe Kopi Kenangan",
                text: "Sejak pakai KasirPOS, antrian jadi lebih cepat dan laporan penjualan otomatis. Sangat membantu!",
                rating: 5,
              },
              {
                name: "Agus Prasetyo",
                role: "Owner Toko Elektronik Jaya",
                text: "Dashboard analytics-nya luar biasa! Saya bisa pantau performa toko dari mana saja, kapan saja.",
                rating: 5,
              },
              {
                name: "Dewi Larasati",
                role: "Manager Restoran Nusantara",
                text: "Tim support sangat responsif dan membantu. Setup awal juga mudah, staff langsung bisa pakai.",
                rating: 5,
              },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{item.text}"
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-bold text-black">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING - Enhanced dengan popular badge */}
      <section id="pricing" className="py-20 md:py-28 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Harga Transparan & Fleksibel
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Starter",
                price: "99K",
                period: "/bulan",
                description: "Untuk bisnis kecil yang baru mulai",
                features: [
                  "Unlimited transaksi",
                  "Laporan dasar",
                  "1 Outlet",
                  "3 User",
                  "Email support",
                ],
                popular: false,
              },
              {
                title: "Professional",
                price: "249K",
                period: "/bulan",
                description: "Paling populer untuk bisnis berkembang",
                features: [
                  "Semua fitur Starter",
                  "Analytics real-time",
                  "3 Outlet",
                  "10 User",
                  "WhatsApp support",
                  "Integrasi payment gateway",
                ],
                popular: true,
              },
              {
                title: "Enterprise",
                price: "Custom",
                period: "",
                description: "Solusi enterprise untuk bisnis besar",
                features: [
                  "Semua fitur Professional",
                  "Unlimited outlet & user",
                  "Custom development",
                  "Dedicated account manager",
                  "Priority support 24/7",
                  "On-premise option",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white text-gray-900 p-8 rounded-2xl ${
                  plan.popular
                    ? "ring-4 ring-yellow-400 shadow-2xl scale-105"
                    : "shadow-lg"
                } hover:shadow-2xl transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    ⭐ Paling Populer
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.price === "Custom" ? "Hubungi Sales" : "Mulai Gratis"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Enhanced */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 shadow-2xl"
          >
            <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Siap Tingkatkan Bisnis Anda?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan bisnis yang telah bertumbuh bersama
              KasirPOS. Coba gratis 14 hari, tanpa kartu kredit.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button className="group px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all shadow-lg font-semibold flex items-center gap-2">
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-gray-900 transition-all font-semibold">
                Jadwalkan Demo
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              ✓ Setup dalam 5 menit ✓ No credit card required ✓ Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - Enhanced */}
      <footer className="py-16 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">KasirPOS</h3>
              <p className="text-sm leading-relaxed">
                Platform POS terlengkap untuk bisnis modern di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrasi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Karir
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 KasirPOS. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </LandingPage>
  );
}