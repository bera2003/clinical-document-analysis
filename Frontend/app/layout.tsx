import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

import { AuthProvider } from "@/context/AuthContext"
import Providers from "./providers";

export const metadata: Metadata = {
  title: "NLP In Clinical Documentation",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
