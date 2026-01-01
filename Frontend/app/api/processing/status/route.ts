import { type NextRequest, NextResponse } from "next/server"
import { getProcessingLogs, getDocuments } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const logs = await getProcessingLogs(limit)
    const documents = await getDocuments()

    const queuedDocs = documents.filter((doc) => doc.status === "uploaded" || doc.status === "processing").length
    const processingRate = Math.floor(Math.random() * 200) + 100 // Entities per minute

    return NextResponse.json({
      logs,
      queuedDocuments: queuedDocs,
      processingRate,
      totalDocuments: documents.length,
    })
  } catch (error) {
    console.error("Status retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve status" }, { status: 500 })
  }
}
