import { type NextRequest, NextResponse } from "next/server"
import { getEntitiesByDocument, getAllEntities } from "@/lib/database"
import { NLPProcessor } from "@/lib/nlp-processor"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")

    if (documentId) {
      const entities = await getEntitiesByDocument(documentId)
      return NextResponse.json({ entities })
    } else {
      const entities = await getAllEntities()
      return NextResponse.json({ entities })
    }
  } catch (error) {
    console.error("Entity retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve entities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 })
    }

    // Quick extraction for single text
    const result = await NLPProcessor.quickExtract(text)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Quick extraction error:", error)
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 })
  }
}
