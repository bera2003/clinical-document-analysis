"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && token) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [user, token, router])

  return null // no UI
}
