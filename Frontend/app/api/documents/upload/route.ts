import { type NextRequest, NextResponse } from "next/server"
import { saveDocument, addProcessingLog } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, file.type, file.size)

    // Validate file type
    const allowedTypes = ["application/pdf", "text/plain", "application/json"]
    if (!allowedTypes.includes(file.type)) {
      console.log("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: PDF, TXT, JSON` }, { status: 400 })
    }

    // Extract text content (simplified)
    console.log("[v0] Extracting file content...")
    const content = await file.text()
    console.log("[v0] Content extracted, length:", content.length)

    // Save document
    console.log("[v0] Saving document to database...")
    const document = await saveDocument({
      filename: file.name,
      content,
      uploadTime: new Date(),
      status: "uploaded",
      fileType: file.type.includes("pdf") ? "pdf" : file.type.includes("json") ? "ehr" : "txt",
      size: file.size,
    })

    console.log("[v0] Document saved with ID:", document.id)

    // Add processing log
    await addProcessingLog({
      documentId: document.id,
      status: "queued",
      progress: 0,
      message: `Document "${file.name}" uploaded and queued for processing`,
      timestamp: new Date(),
    })

    console.log("[v0] Processing log added")

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        status: document.status,
        uploadTime: document.uploadTime,
      },
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
        success: false,
      },
      { status: 500 },
    )
  }
}
