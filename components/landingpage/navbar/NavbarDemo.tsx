"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, animate } from "framer-motion";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export function NavbarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Fitur", link: "#features" },
    { name: "Kenapa Kami", link: "#why-choose-us" },
    { name: "Testimonial", link: "#testimonials" },
    { name: "Harga", link: "#pricing" },
  ];

  const router = useRouter();

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement;
    if (!el) return;

    const targetY = el.offsetTop;

    animate(window.scrollY, targetY, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      onUpdate: (value) => window.scrollTo(0, value),
    });
  };

  return (
    <Navbar className="fixed top-0 w-full text-gray-900 z-50">
      {/* Desktop */}
    <NavBody className="hidden md:flex max-w-6xl mx-auto px-6 items-center">
  {/* Logo desktop hanya tampil di md+ */}
  <div className="hidden md:block text-xl font-bold tracking-tight">KasirPOS</div>

  {/* NavItems desktop */}
  <div className="hidden md:flex flex-1 justify-center gap-10 ml-5">
    {navItems.map((item) => (
      <button
        key={item.name}
        onClick={() => scrollToSection(item.link)}
        className="text-gray-900 hover:text-gray-700 font-medium"
      >
        {item.name}
      </button>
    ))}
  </div>

  {/* Desktop buttons */}
  <div className="hidden md:flex items-center gap-2">
    <NavbarButton
  variant="secondary"
  onClick={() => router.push("/login")}
>
  Masuk
</NavbarButton>
    <NavbarButton variant="primary" 
    onClick={() => router.push("/register")}
  >
   Coba Gratis</NavbarButton>
  </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader className="max-w-6xl mx-auto px-6 flex justify-between items-center">
         <div className="text-xl font-bold">KasirPOS</div>
    <MobileNavToggle
      isOpen={isMobileMenuOpen}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    />
        </MobileNavHeader>

        {/* Mobile menu hanya satu */}
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              onClick={() => {
                scrollToSection(item.link);
                setIsMobileMenuOpen(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full text-left text-neutral-700 py-2"
            >
              {item.name}
            </motion.button>
          ))}

          <div className="flex flex-col gap-4 pt-4">
            <NavbarButton
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Masuk
            </NavbarButton>

            <NavbarButton
              variant="primary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Coba Gratis
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
