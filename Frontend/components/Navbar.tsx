"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";

export default function Navbar() {

  const pathname = usePathname();

const hidePrefixes = [
  "/login",
  "/signup",
  "/dashboard",
  "/entities",
  "/profile",
];

if (hidePrefixes.some(route => pathname.startsWith(route))) {
  return null;
}

  return (
    <nav
      className="
        sticky top-0 z-50
        flex justify-between items-center
        px-8 py-5
        backdrop-blur-xl
        bg-indigo-950/70
        border-b border-indigo-500/20
        shadow-lg shadow-black/20
      "
    >

      {/* LOGO */}
      <Link
        href="/"
        className="
          flex items-center gap-2
          text-lg font-semibold text-white
          hover:opacity-80 transition
        "
      >
        <Stethoscope className="text-blue-400" />
        Clinical NLP
      </Link>



      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-4">

        {/* Login */}
        <Link
          href="/login"
          className="
            px-4 py-2
            rounded-lg
            border border-white/20
            text-gray-200
            hover:bg-white/10
            hover:border-white/40
            transition-all duration-200
          "
        >
          Login
        </Link>


        {/* Get Started */}
        <Link
          href="/signup"
          className="
            px-5 py-2
            bg-blue-500
            text-white
            font-semibold
            rounded-lg
            hover:bg-blue-600
            transition
            shadow-lg shadow-blue-900/40
          "
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
}
