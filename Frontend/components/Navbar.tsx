"use client";

import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function Navbar() {

  const router = useRouter();

  return (
    <nav className="
  sticky top-0 z-50
  flex justify-between items-center
  px-8 py-5
  backdrop-blur-xl
  bg-indigo-950/70
  border-b border-indigo-500/20
">

      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-lg font-semibold text-white cursor-pointer"
      >
        <Stethoscope className="text-blue-400" />
        Clinical NLP
      </div>

      <div className="flex gap-4">
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

        <button
          onClick={() => router.push("/signup")}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>

    </nav>
  );
}
