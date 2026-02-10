"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Stethoscope } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {

  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* 🔥 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-70" />

      <div className="absolute inset-0 backdrop-blur-3xl" />

      {/* NAVBAR */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6">

        <div className="flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="text-blue-400" />
          Clinical NLP
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>

      </nav>


      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32">

        <motion.h1
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7 }}
          className="text-5xl md:text-7xl font-bold max-w-5xl leading-tight"
        >
          Transform Clinical Documents Into
          <span className="text-blue-400"> Intelligent Insights</span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.2 }}
          className="mt-6 text-lg text-gray-300 max-w-2xl"
        >
          Clinical NLP leverages cutting-edge artificial intelligence to
          extract meaning from unstructured healthcare data — securely,
          instantly, and at scale.
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4 }}
          className="flex gap-4 mt-10"
        >
          <button
            onClick={() => router.push("/signup")}
            className="px-8 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-900/40"
          >
            Start Free
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
          >
            Login
          </button>
        </motion.div>

      </section>



      {/* FEATURES */}
      <section className="relative z-10 mt-32 grid md:grid-cols-3 gap-8 px-10 pb-24 max-w-6xl mx-auto">

        {[
          {
            title:"AI-Powered Extraction",
            desc:"Automatically detect medical entities, diagnoses, and treatment insights from clinical notes."
          },
          {
            title:"Enterprise Security",
            desc:"Built with healthcare-grade privacy to ensure sensitive patient data remains protected."
          },
          {
            title:"Real-Time Intelligence",
            desc:"Upload documents and receive structured analytics within seconds."
          }
        ].map((feature, i)=>(
          <motion.div
            key={i}
            whileHover={{ y:-10 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-300">
              {feature.desc}
            </p>
          </motion.div>
        ))}

      </section>



      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
  <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">

    {/* BRAND */}
    <div>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Stethoscope className="text-blue-400" />
        Clinical NLP
      </div>

      <p className="text-gray-400 mt-4">
        Transforming healthcare data into actionable intelligence using
        advanced artificial intelligence.
      </p>
    </div>

    {/* PRODUCT */}

<div>
  <h4 className="font-semibold mb-4">Product</h4>
  <ul className="space-y-2 text-gray-400">

    <li>
      <Link href="/features" className="hover:text-white transition">
        Features
      </Link>
    </li>

    <li>
      <Link href="/security" className="hover:text-white transition">
        Security
      </Link>
    </li>

    <li>
      <Link href="/api" className="hover:text-white transition">
        API
      </Link>
    </li>

    <li>
      <Link href="/integrations" className="hover:text-white transition">
        Integrations
      </Link>
    </li>

  </ul>
</div>

    {/* COMPANY */}
    <div>
      <h4 className="font-semibold mb-4">Company</h4>
      <ul className="space-y-2 text-gray-400">
        <li>About</li>
        <li>Contact</li>
        <li>Blog</li>
      </ul>
    </div>

    {/* LEGAL */}
    <div>
      <h4 className="font-semibold mb-4">Legal</h4>
      <ul className="space-y-2 text-gray-400">
        <li>Privacy Policy</li>
        <li>Terms of Service</li>
        <li>HIPAA Compliance</li>
      </ul>
    </div>

  </div>

  <div className="text-center text-gray-500 pb-8">
    © {new Date().getFullYear()} Clinical NLP — AI for Modern Healthcare
  </div>
</footer>

    </div>
  )
}
