"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      setMessage(data.message)

    } catch (error) {
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md 
bg-white/70 backdrop-blur-xl
border border-white/20
p-10 rounded-2xl shadow-2xl"
      >

        <h2 className="text-3xl font-bold mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          required
          className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-600 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="text-green-600 mt-4 text-sm">
            {message}
          </p>
        )}

      </motion.form>

    </div>
  )
}
