import type { Entity } from "./types"

// Mock NLP models and processing
export class NLPProcessor {
  private static medicalTerms = {
    diseases: [
      { term: "diabetes", icdCode: "E11.9", confidence: 0.95 },
      { term: "hypertension", icdCode: "I10", confidence: 0.92 },
      { term: "pneumonia", icdCode: "J18.9", confidence: 0.88 },
      { term: "asthma", icdCode: "J45.9", confidence: 0.91 },
      { term: "copd", icdCode: "J44.1", confidence: 0.89 },
      { term: "coronary artery disease", icdCode: "I25.10", confidence: 0.93 },
      { term: "chronic kidney disease", icdCode: "N18.9", confidence: 0.87 },
    ],
    symptoms: [
      { term: "chest pain", confidence: 0.85 },
      { term: "shortness of breath", confidence: 0.88 },
      { term: "fatigue", confidence: 0.75 },
      { term: "nausea", confidence: 0.82 },
      { term: "headache", confidence: 0.79 },
      { term: "dizziness", confidence: 0.81 },
      { term: "fever", confidence: 0.9 },
    ],
    medications: [
      { term: "metformin", rxNormCode: "6809", confidence: 0.96 },
      { term: "lisinopril", rxNormCode: "29046", confidence: 0.94 },
      { term: "atorvastatin", rxNormCode: "83367", confidence: 0.93 },
      { term: "insulin", rxNormCode: "5856", confidence: 0.91 },
      { term: "aspirin", rxNormCode: "1191", confidence: 0.89 },
      { term: "warfarin", rxNormCode: "11289", confidence: 0.92 },
    ],
    procedures: [
      { term: "echocardiogram", confidence: 0.88 },
      { term: "ct scan", confidence: 0.92 },
      { term: "mri", confidence: 0.9 },
      { term: "blood test", confidence: 0.85 },
      { term: "x-ray", confidence: 0.87 },
    ],
  }

  static async extractEntities(text: string, documentId: string): Promise<Omit<Entity, "id">[]> {
    const entities: Omit<Entity, "id">[] = []
    const lowerText = text.toLowerCase()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Extract diseases
    this.medicalTerms.diseases.forEach((disease) => {
      const regex = new RegExp(`\\b${disease.term}\\b`, "gi")
      let match
      while ((match = regex.exec(text)) !== null) {
        entities.push({
          documentId,
          text: match[0],
          type: "disease",
          confidence: disease.confidence + (Math.random() - 0.5) * 0.1,
          startPos: match.index,
          endPos: match.index + match[0].length,
          icdCode: disease.icdCode,
        })
      }
    })

    // Extract symptoms
    this.medicalTerms.symptoms.forEach((symptom) => {
      const regex = new RegExp(`\\b${symptom.term}\\b`, "gi")
      let match
      while ((match = regex.exec(text)) !== null) {
        entities.push({
          documentId,
          text: match[0],
          type: "symptom",
          confidence: symptom.confidence + (Math.random() - 0.5) * 0.1,
          startPos: match.index,
          endPos: match.index + match[0].length,
        })
      }
    })

    // Extract medications
    this.medicalTerms.medications.forEach((medication) => {
      const regex = new RegExp(`\\b${medication.term}\\b`, "gi")
      let match
      while ((match = regex.exec(text)) !== null) {
        entities.push({
          documentId,
          text: match[0],
          type: "medication",
          confidence: medication.confidence + (Math.random() - 0.5) * 0.1,
          startPos: match.index,
          endPos: match.index + match[0].length,
          rxNormCode: medication.rxNormCode,
        })
      }
    })

    // Extract lab values (simple pattern matching)
    const labRegex = /(\w+)\s*[=:]\s*(\d+\.?\d*)\s*(%|mg\/dl|mmol\/l|units?)/gi
    let labMatch
    while ((labMatch = labRegex.exec(text)) !== null) {
      entities.push({
        documentId,
        text: labMatch[0],
        type: "lab_value",
        confidence: 0.85 + Math.random() * 0.1,
        startPos: labMatch.index,
        endPos: labMatch.index + labMatch[0].length,
      })
    }

    return entities
  }

  static async quickExtract(text: string): Promise<{ entities: number; confidence: number; preview: string[] }> {
    // Simulate quick processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    const entityCount = Math.floor(Math.random() * 15) + 5
    const confidence = 0.85 + Math.random() * 0.1
    const preview = [
      "Type 2 Diabetes (ICD: E11.9)",
      "Metformin 500mg (RxNorm: 6809)",
      "Chest pain symptom",
      "HbA1c = 8.2%",
    ].slice(0, Math.min(4, entityCount))

    return { entities: entityCount, confidence, preview }
  }
}
