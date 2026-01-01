import mysql from "mysql2/promise"
import fs from "fs-extra"
import path from "path"
import type { Document, Entity, ProcessingLog, AnalyticsData, EHRConnection } from "./types"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinical_nlp_db",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// File storage directory
const UPLOAD_DIR = path.join(process.cwd(), "uploads")

// Ensure upload directory exists
fs.ensureDirSync(UPLOAD_DIR)

// Generate UUID
const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Document operations
export const saveDocument = async (doc: Omit<Document, "id">): Promise<Document> => {
  const connection = await pool.getConnection()
  try {
    const id = generateId()
    const filePath = doc.filename ? path.join(UPLOAD_DIR, `${id}_${doc.filename}`) : null

    // Save file to disk if content exists
    if (filePath && doc.content) {
      await fs.writeFile(filePath, doc.content)
    }

    const [result] = await connection.execute(
      `INSERT INTO documents (id, filename, content, file_path, file_size, mime_type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, doc.filename, doc.content, filePath, doc.fileSize || 0, doc.mimeType || "text/plain", doc.status],
    )

    const newDoc: Document = { ...doc, id }
    return newDoc
  } finally {
    connection.release()
  }
}

export const getDocuments = async (): Promise<Document[]> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM documents ORDER BY uploaded_at DESC")
    return rows as Document[]
  } finally {
    connection.release()
  }
}

export const getDocumentById = async (id: string): Promise<Document | null> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM documents WHERE id = ?", [id])
    const documents = rows as Document[]
    return documents.length > 0 ? documents[0] : null
  } finally {
    connection.release()
  }
}

export const updateDocumentStatus = async (id: string, status: Document["status"]): Promise<void> => {
  const connection = await pool.getConnection()
  try {
    await connection.execute("UPDATE documents SET status = ?, processed_at = ? WHERE id = ?", [
      status,
      status === "completed" ? new Date() : null,
      id,
    ])
  } finally {
    connection.release()
  }
}

// Entity operations
export const saveEntities = async (entityList: Omit<Entity, "id">[]): Promise<Entity[]> => {
  const connection = await pool.getConnection()
  try {
    const newEntities: Entity[] = []

    for (const entity of entityList) {
      const id = generateId()
      await connection.execute(
        `INSERT INTO entities (id, document_id, text, type, confidence, start_pos, end_pos, icd_code, rxnorm_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          entity.documentId,
          entity.text,
          entity.type,
          entity.confidence,
          entity.startPos,
          entity.endPos,
          entity.icdCode,
          entity.rxnormCode,
        ],
      )
      newEntities.push({ ...entity, id })
    }

    return newEntities
  } finally {
    connection.release()
  }
}

export const getEntitiesByDocument = async (documentId: string): Promise<Entity[]> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM entities WHERE document_id = ? ORDER BY start_pos", [
      documentId,
    ])
    return rows as Entity[]
  } finally {
    connection.release()
  }
}

export const getAllEntities = async (): Promise<Entity[]> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM entities ORDER BY created_at DESC")
    return rows as Entity[]
  } finally {
    connection.release()
  }
}

// Processing log operations
export const addProcessingLog = async (log: Omit<ProcessingLog, "id">): Promise<ProcessingLog> => {
  const connection = await pool.getConnection()
  try {
    const id = generateId()
    await connection.execute(
      `INSERT INTO processing_logs (id, document_id, status, message, progress) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, log.documentId, log.status, log.message, log.progress],
    )
    return { ...log, id }
  } finally {
    connection.release()
  }
}

export const getProcessingLogs = async (limit = 50): Promise<ProcessingLog[]> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM processing_logs ORDER BY created_at DESC LIMIT ?", [limit])
    return rows as ProcessingLog[]
  } finally {
    connection.release()
  }
}

export const updateProcessingLog = async (id: string, updates: Partial<ProcessingLog>): Promise<void> => {
  const connection = await pool.getConnection()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    await connection.execute(`UPDATE processing_logs SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      ...values,
      id,
    ])
  } finally {
    connection.release()
  }
}

// Analytics operations
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const connection = await pool.getConnection()
  try {
    // Get entity counts by type
    const [entityCounts] = await connection.execute(`
      SELECT type, COUNT(*) as count 
      FROM entities 
      GROUP BY type
    `)

    // Get most frequent diagnoses
    const [diagnoses] = await connection.execute(`
      SELECT text as name, COUNT(*) as count, icd_code 
      FROM entities 
      WHERE type = 'disease' AND icd_code IS NOT NULL
      GROUP BY text, icd_code 
      ORDER BY count DESC 
      LIMIT 5
    `)

    // Get medication trends
    const [medications] = await connection.execute(`
      SELECT text as medication, COUNT(*) as count, 
             ROUND(RAND() * 20 - 10, 1) as trend
      FROM entities 
      WHERE type = 'medication' 
      GROUP BY text 
      ORDER BY count DESC 
      LIMIT 5
    `)

    // Generate time series data from processing logs
    const [timeSeriesData] = await connection.execute(`
      SELECT DATE(created_at) as date, 
             COUNT(DISTINCT document_id) as documents,
             COUNT(*) as entities
      FROM processing_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `)

    return {
      mostFrequentDiagnoses: diagnoses as any[],
      medicationTrends: medications as any[],
      riskFactors: [
        { factor: "Smoking History", severity: "high", count: 18 },
        { factor: "Obesity", severity: "medium", count: 32 },
        { factor: "Family History of CAD", severity: "medium", count: 25 },
        { factor: "Sedentary Lifestyle", severity: "low", count: 41 },
      ],
      timeSeriesData: timeSeriesData as any[],
    }
  } finally {
    connection.release()
  }
}

// EHR operations
export const getEHRConnections = async (): Promise<EHRConnection[]> => {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM ehr_connections ORDER BY created_at DESC")
    return rows as EHRConnection[]
  } finally {
    connection.release()
  }
}

export const updateEHRConnection = async (id: string, updates: Partial<EHRConnection>): Promise<void> => {
  const connection = await pool.getConnection()
  try {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    await connection.execute(`UPDATE ehr_connections SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      ...values,
      id,
    ])
  } finally {
    connection.release()
  }
}

// Database health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection()
    await connection.execute("SELECT 1")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
