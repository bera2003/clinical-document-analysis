"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Stethoscope, Mail, Lock, User } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const success = await signup(name, email, password)
    setLoading(false)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Signup failed. Email may already exist.")
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-col justify-center px-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/20 rounded-xl">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold">Clinical NLP</h1>
        </div>

        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Join the<br />Healthcare AI<br />Revolution
        </h2>

        <p className="text-white/90 max-w-md text-lg mb-10">
          Create your account and start analyzing clinical documents with
          AI-powered NLP insights in minutes.
        </p>

        <ul className="space-y-4 text-white/90 text-lg">
          <li>✔ AI-powered clinical entity extraction</li>
          <li>✔ Secure document processing</li>
          <li>✔ Analytics & insights dashboard</li>
        </ul>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl"
        >
          <h3 className="text-3xl font-bold text-gray-900">
            Create your account
          </h3>
          <p className="text-gray-500 mt-1 mb-8">
            Start analyzing clinical documents in minutes
          </p>

          {/* Name */}
          <div className="relative mb-5">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full name"
              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative mb-5">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-5">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-700 font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
