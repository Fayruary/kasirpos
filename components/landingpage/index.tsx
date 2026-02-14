import { ReactNode } from "react";
import { NavbarDemo } from "./navbar/NavbarDemo";

interface LandingPageProps {
  children: ReactNode;
}

export default function LandingPage({ children }: LandingPageProps) {
  return (
    <div className="w-full bg-white relative overflow-hidden">

      {/* Navbar */}
      <NavbarDemo />

      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-16">
        {children}
      </div>

    </div>
  );
}
