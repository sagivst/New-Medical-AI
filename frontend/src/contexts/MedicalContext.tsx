import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProcessedDocument {
  id: string
  filename: string
  fileType: string
  fileSize: string
  uploadDate: string
  extractedText: string
  medicalEntities: {
    medications: string[]
    conditions: string[]
    procedures: string[]
    dates: string[]
  }
  fhirData: any
  confidence: number
  language: string
  specialty?: string
}

interface MedicalContextType {
  processedDocuments: ProcessedDocument[]
  addProcessedDocument: (doc: ProcessedDocument) => void
  getRecommendedSpecialty: () => string | null
  getRelevantConditions: () => string[]
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined)

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>(() => {
    const saved = localStorage.getItem('medicalDocuments')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('medicalDocuments', JSON.stringify(processedDocuments))
  }, [processedDocuments])

  const addProcessedDocument = (doc: ProcessedDocument) => {
    setProcessedDocuments(prev => [...prev, doc])
  }

  const getRecommendedSpecialty = (): string | null => {
    if (processedDocuments.length === 0) return null
    
    const latestDoc = processedDocuments[processedDocuments.length - 1]
    const conditions = latestDoc.medicalEntities.conditions
    
    if (conditions.some(c => c.toLowerCase().includes('heart') || c.toLowerCase().includes('cardiac') || c.toLowerCase().includes('coronary'))) {
      return 'cardiology'
    }
    if (conditions.some(c => c.toLowerCase().includes('diabetes') || c.toLowerCase().includes('endocrin') || c.toLowerCase().includes('metabolic'))) {
      return 'endocrinology'
    }
    if (conditions.some(c => c.toLowerCase().includes('bone') || c.toLowerCase().includes('joint') || c.toLowerCase().includes('orthopedic') || c.toLowerCase().includes('knee') || c.toLowerCase().includes('fracture'))) {
      return 'orthopedics'
    }
    if (conditions.some(c => c.toLowerCase().includes('skin') || c.toLowerCase().includes('rash') || c.toLowerCase().includes('dermat'))) {
      return 'dermatology'
    }
    if (conditions.some(c => c.toLowerCase().includes('head') || c.toLowerCase().includes('neuro') || c.toLowerCase().includes('brain'))) {
      return 'neurology'
    }
    
    return null
  }

  const getRelevantConditions = (): string[] => {
    if (processedDocuments.length === 0) return []
    
    const latestDoc = processedDocuments[processedDocuments.length - 1]
    return latestDoc.medicalEntities.conditions
  }

  return (
    <MedicalContext.Provider value={{
      processedDocuments,
      addProcessedDocument,
      getRecommendedSpecialty,
      getRelevantConditions
    }}>
      {children}
    </MedicalContext.Provider>
  )
}

export function useMedical() {
  const context = useContext(MedicalContext)
  if (context === undefined) {
    throw new Error('useMedical must be used within a MedicalProvider')
  }
  return context
}
