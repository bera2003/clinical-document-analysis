"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {

  const { token } = useParams()
  const router = useRouter()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleReset = async (e:any) => {
    e.preventDefault()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        token,
        new_password:newPassword,
        confirm_password:confirmPassword
      })
    })

    const data = await res.json()

    if(res.ok){
      setMessage("Password updated! Redirecting to login...")
      setTimeout(()=>router.push("/login"),2000)
    }else{
      setMessage(data.detail)
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">

      <form
        onSubmit={handleReset}
        className="relative z-10 w-full max-w-md 
bg-white/70 backdrop-blur-xl
border border-white/20
p-10 rounded-2xl shadow-2xl"
      >

        <h2 className="text-3xl font-bold mb-6">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          required
          className="w-full border px-4 py-3 rounded-lg mb-4"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full border px-4 py-3 rounded-lg mb-6"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        <button className="w-full bg-blue-700 text-white py-3 rounded-lg">
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-center text-green-600">
            {message}
          </p>
        )}

      </form>

    </div>
  )
}
