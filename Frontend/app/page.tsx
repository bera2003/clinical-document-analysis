"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Stethoscope } from "lucide-react"

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
      <footer className="relative z-10 text-center pb-10 text-gray-400 border-t border-white/10 pt-6">
        © {new Date().getFullYear()} Clinical NLP — AI for Modern Healthcare
      </footer>

    </div>
  )
}
