import { type NextRequest, NextResponse } from "next/server"
import {
  getDocumentById,
  updateDocumentStatus,
  saveEntities,
  addProcessingLog,
  updateProcessingLog,
} from "@/lib/database"
import { NLPProcessor } from "@/lib/nlp-processor"

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 })
    }

    const document = await getDocumentById(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update status to processing
    await updateDocumentStatus(documentId, "processing")

    const processingLog = await addProcessingLog({
      documentId,
      status: "processing",
      progress: 0,
      message: "Starting NLP analysis",
      timestamp: new Date(),
    })

    // Simulate processing steps
    const steps = [
      { progress: 25, message: "Preprocessing text" },
      { progress: 50, message: "Running entity extraction" },
      { progress: 75, message: "Mapping to medical codes" },
      { progress: 100, message: "Processing complete" },
    ]

    // Process in background (simplified simulation)
    setTimeout(async () => {
      try {
        for (const step of steps) {
          await updateProcessingLog(processingLog.id, {
            progress: step.progress,
            message: step.message,
          })
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        // Extract entities
        const entities = await NLPProcessor.extractEntities(document.content, documentId)
        await saveEntities(entities)

        // Update final status
        await updateDocumentStatus(documentId, "completed")
        await updateProcessingLog(processingLog.id, {
          status: "completed",
          progress: 100,
          message: `Extracted ${entities.length} entities`,
          processingTime: Date.now() - processingLog.timestamp.getTime(),
        })
      } catch (error) {
        await updateDocumentStatus(documentId, "error")
        await updateProcessingLog(processingLog.id, {
          status: "error",
          message: "Processing failed",
        })
      }
    }, 100)

    return NextResponse.json({
      success: true,
      message: "Processing started",
      processingId: processingLog.id,
    })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
