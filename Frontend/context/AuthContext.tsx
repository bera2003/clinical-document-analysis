"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔥 Restore auth on refresh + handle Google login
  useEffect(() => {

  if (status === "loading") return;

  // ✅ GOOGLE LOGIN DETECTED
  if (status === "authenticated" && session?.user) {

  const accessToken = (session as any)?.accessToken;

  // 🚨 VERY IMPORTANT
  if (!accessToken) {
    console.error("No backend token received from Google login");
    setLoading(false);
    return;
  }

  setToken(accessToken);

  const googleUser = {
    id: (session.user as any)?.id || 0,
    name: session.user.name || "",
    email: session.user.email || ""
  };

  setUser(googleUser);

  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(googleUser));

  setLoading(false);
  return;
}


  // ✅ NORMAL LOGIN RESTORE
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser) {
    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }

  setLoading(false);

}, [session, status]);


  // ---------------- LOGIN ----------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // ---------------- SIGNUP ----------------
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Optional: also logout from Google session
    window.location.href = "/api/auth/signout"
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
