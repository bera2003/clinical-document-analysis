"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Stethoscope, Mail, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(email, password)
    setLoading(false)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">

      {/* LEFT BRANDING */}
      <div className="hidden md:flex flex-col justify-center px-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/20 rounded-xl">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold">Clinical NLP</h1>
        </div>

        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Welcome back to<br />Healthcare AI
        </h2>

        <p className="text-white/90 max-w-md text-lg mb-10">
          Securely access your dashboard and continue analyzing
          clinical documents with AI-powered NLP insights.
        </p>

        <ul className="space-y-4 text-white/90 text-lg">
          <li>✔ Secure document processing</li>
          <li>✔ Real-time clinical analytics</li>
          <li>✔ Enterprise-grade data privacy</li>
        </ul>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="animated-bg relative overflow-hidden flex items-center justify-center">

        {/* Animated blobs */}
        <motion.div
          className="blob blob-blue absolute"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="blob blob-purple absolute"
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 30, -40, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* LOGIN CARD */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md p-10 rounded-2xl shadow-2xl 
          bg-white/70 backdrop-blur-xl border border-white/20"
        >

          {/* Stagger Wrapper */}
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >

            {/* Heading */}
            <motion.h3
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-3xl font-bold text-gray-900"
            >
              Sign in to your account
            </motion.h3>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-gray-500 mt-1 mb-8"
            >
              Continue analyzing clinical documents
            </motion.p>

            {/* Email */}
            <motion.div variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }} className="relative mb-5">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }} className="relative mb-6">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Forgot Password */}
            <motion.div variants={{ hidden:{opacity:0}, visible:{opacity:1} }} className="text-right mb-6">
              <span
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-blue-700 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </motion.div>

            {/* Error Animation */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 text-sm mb-4 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>

            {/* Divider */}
            <motion.div variants={{ hidden:{opacity:0}, visible:{opacity:1} }}
              className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </motion.div>

            {/* Social Buttons */}
            <motion.div variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}
              className="grid grid-cols-2 gap-3">

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="py-3 border rounded-lg bg-white hover:bg-gray-50 font-semibold transition"
              >
                Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="py-3 border rounded-lg bg-white hover:bg-gray-50 font-semibold transition"
              >
                SSO
              </motion.button>

            </motion.div>

            {/* Signup */}
            <motion.p variants={{ hidden:{opacity:0}, visible:{opacity:1} }}
              className="text-sm text-gray-600 text-center mt-6">
              Don’t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-700 font-semibold cursor-pointer hover:underline"
              >
                Create account
              </span>
            </motion.p>

          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}
