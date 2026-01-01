import { NextResponse } from "next/server"
import { getAnalyticsData } from "@/lib/database"

export async function GET() {
  try {
    const analytics = await getAnalyticsData()
    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to retrieve analytics" }, { status: 500 })
  }
}
