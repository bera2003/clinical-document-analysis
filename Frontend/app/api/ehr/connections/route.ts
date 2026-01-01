import { type NextRequest, NextResponse } from "next/server"
import { getEHRConnections, updateEHRConnection } from "@/lib/database"

export async function GET() {
  try {
    const connections = await getEHRConnections()
    return NextResponse.json({ connections })
  } catch (error) {
    console.error("EHR connections error:", error)
    return NextResponse.json({ error: "Failed to retrieve connections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { connectionId, action } = await request.json()

    if (action === "sync") {
      // Simulate FHIR sync
      await updateEHRConnection(connectionId, {
        lastSync: new Date(),
        status: "connected",
      })

      return NextResponse.json({
        success: true,
        message: "EHR sync completed",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("EHR action error:", error)
    return NextResponse.json({ error: "EHR action failed" }, { status: 500 })
  }
}
