export interface Document {
  id: string
  filename: string
  content: string
  uploadTime: Date
  status: "uploaded" | "processing" | "completed" | "error"
  fileType: "pdf" | "txt" | "ehr"
  size: number
}

export interface Entity {
  id: string
  documentId: string
  text: string
  type: "disease" | "symptom" | "medication" | "lab_value" | "procedure"
  confidence: number
  startPos: number
  endPos: number
  icdCode?: string
  rxNormCode?: string
  umlsCode?: string
}

export interface ProcessingLog {
  id: string
  documentId: string
  status: "queued" | "processing" | "completed" | "error"
  progress: number
  message: string
  timestamp: Date
  processingTime?: number
}

export interface AnalyticsData {
  mostFrequentDiagnoses: Array<{ name: string; count: number; icdCode: string }>
  medicationTrends: Array<{ medication: string; count: number; trend: number }>
  riskFactors: Array<{ factor: string; severity: "low" | "medium" | "high"; count: number }>
  timeSeriesData: Array<{ date: string; documents: number; entities: number }>
}

export interface EHRConnection {
  id: string
  name: string
  type: "epic" | "cerner" | "allscripts" | "other"
  status: "connected" | "disconnected" | "error"
  lastSync: Date
  fhirEndpoint: string
}
