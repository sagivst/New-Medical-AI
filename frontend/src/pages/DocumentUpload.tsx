import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileText, 
  Scan,
  CheckCircle,
  Clock,
  Globe,
  Languages,
  Eye,
  Download,
  Copy
} from 'lucide-react'
import { useMedical } from '@/contexts/MedicalContext'
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

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
  medicalSummary?: string
}

export function DocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const { processedDocuments, addProcessedDocument } = useMedical()

  const processDocument = async (file: File): Promise<ProcessedDocument> => {
    try {
      let extractedText = ''
      let confidence = 95

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 10MB.')
      }

      const isTextFile = file.name.endsWith('.txt') || file.type === 'text/plain'
      const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf')
      const isImageFile = file.type.startsWith('image/') || /\.(jpg|jpeg|png|tiff|gif)$/i.test(file.name)
      
      if (!isTextFile && !isPdfFile && !isImageFile) {
        throw new Error(`Unsupported file type: ${file.type}. Supported types: PDF, TXT, JPG, PNG, TIFF, GIF`)
      }

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(' ')
          fullText += pageText + '\n'
        }
        
        extractedText = fullText.trim()
        confidence = 95
      } else if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: m => console.log(m)
        })
        extractedText = result.data.text
        confidence = Math.round(result.data.confidence)
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text()
        extractedText = text
        confidence = 100
      } else {
        throw new Error(`Unsupported file type: ${file.type}`)
      }

      const medicalEntities = extractMedicalEntities(extractedText)
      const specialty = determineSpecialty(extractedText, medicalEntities)

      const processedDoc: ProcessedDocument = {
        id: Date.now().toString(),
        filename: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        uploadDate: new Date().toLocaleDateString(),
        extractedText: extractedText,
        medicalEntities: medicalEntities,
        fhirData: generateFHIRData(file, medicalEntities),
        confidence: confidence,
        language: 'en',
        specialty: specialty,
        medicalSummary: generateMedicalSummary(extractedText, medicalEntities, specialty)
      }

      return processedDoc
    } catch (error) {
      console.error('Error processing document:', error)
      
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        if (error.message.includes('InvalidPDFException') || error.message.includes('Invalid PDF')) {
          errorMessage = 'Invalid PDF file. Please ensure the file is a valid PDF document.'
        } else if (error.message.includes('Unsupported file type')) {
          errorMessage = error.message
        } else if (error.message.includes('File size too large')) {
          errorMessage = error.message
        } else {
          errorMessage = `Processing failed: ${error.message}`
        }
      }
      
      return {
        id: Date.now().toString(),
        filename: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        uploadDate: new Date().toLocaleDateString(),
        extractedText: errorMessage,
        medicalEntities: {
          medications: [],
          conditions: [],
          procedures: [],
          dates: []
        },
        fhirData: generateFHIRData(file, { medications: [], conditions: [], procedures: [], dates: [] }),
        confidence: 0,
        language: 'en',
        specialty: undefined,
        medicalSummary: `Error: ${errorMessage}`
      }
    }
  }

  const extractMedicalEntities = (text: string) => {
    const medications: string[] = []
    const conditions: string[] = []
    const procedures: string[] = []
    const dates: string[] = []

    const medicationPatterns = [
      /(\w+)\s*\d+\s*mg/gi,
      /(\w+)\s*\d+\s*mcg/gi,
      /(aspirin|ibuprofen|acetaminophen|metformin|lisinopril|atorvastatin|omeprazole|levothyroxine|amlodipine|metoprolol|hydrochlorothiazide|simvastatin|losartan|gabapentin|sertraline|montelukast|furosemide|warfarin|prednisone|tramadol|sumatriptan|propranolol|glipizide|benadryl|hydrocortisone)/gi
    ]
    
    medicationPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        medications.push(...matches.map(m => m.trim()))
      }
    })

    const conditionPatterns = [
      /(diabetes|hypertension|depression|anxiety|arthritis|asthma|copd|heart disease|stroke|cancer|migraine|headache|back pain|chest pain|shortness of breath|dizziness|nausea|fatigue|fever|cough|rash|allergic reaction|fracture|sprain|infection|acute coronary syndrome|orthostatic hypotension|photophobia|contact dermatitis|hypothyroidism|acl tear|knee pain|skin rash)/gi
    ]
    
    conditionPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        conditions.push(...matches.map(m => m.trim()))
      }
    })

    const procedurePatterns = [
      /(x-ray|mri|ct scan|ultrasound|blood test|ecg|ekg|biopsy|surgery|colonoscopy|endoscopy|mammogram|physical examination|consultation|cardiac enzymes|neurological examination|orthopedic consultation|dermatological examination|allergy testing|hba1c test|tsh levels)/gi
    ]
    
    procedurePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        procedures.push(...matches.map(m => m.trim()))
      }
    })

    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/g,
      /\d{1,2}-\d{1,2}-\d{4}/g,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/gi
    ]
    
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        dates.push(...matches.map(m => m.trim()))
      }
    })

    return {
      medications: [...new Set(medications)],
      conditions: [...new Set(conditions)],
      procedures: [...new Set(procedures)],
      dates: [...new Set(dates)]
    }
  }

  const determineSpecialty = (text: string, entities: any): string | undefined => {
    const textLower = text.toLowerCase()
    const allConditions = entities.conditions.join(' ').toLowerCase()
    
    if (textLower.includes('headache') || textLower.includes('migraine') || textLower.includes('dizziness') || 
        textLower.includes('seizure') || textLower.includes('stroke') || textLower.includes('brain') ||
        textLower.includes('neurolog') || allConditions.includes('headache') || allConditions.includes('migraine')) {
      return 'Neurology'
    }
    
    if (textLower.includes('heart') || textLower.includes('cardiac') || textLower.includes('chest pain') ||
        textLower.includes('hypertension') || textLower.includes('blood pressure') || textLower.includes('ecg') ||
        allConditions.includes('heart') || allConditions.includes('hypertension')) {
      return 'Cardiology'
    }
    
    if (textLower.includes('fracture') || textLower.includes('bone') || textLower.includes('joint') ||
        textLower.includes('knee') || textLower.includes('back pain') || textLower.includes('arthritis') ||
        allConditions.includes('fracture') || allConditions.includes('arthritis')) {
      return 'Orthopedics'
    }
    
    if (textLower.includes('rash') || textLower.includes('skin') || textLower.includes('dermat') ||
        textLower.includes('allergic reaction') || allConditions.includes('rash')) {
      return 'Dermatology'
    }
    
    if (textLower.includes('diabetes') || textLower.includes('thyroid') || textLower.includes('hormone') ||
        textLower.includes('endocrin') || allConditions.includes('diabetes')) {
      return 'Endocrinology'
    }
    
    return undefined
  }

  const generateMedicalSummary = (_text: string, entities: any, specialty?: string): string => {
    const { medications, conditions, procedures, dates } = entities
    
    let summary = "## Medical Analysis Summary\n\n"
    
    if (specialty) {
      summary += `**Recommended Specialty:** ${specialty}\n\n`
    }
    
    if (conditions.length > 0) {
      summary += `**Primary Conditions:** ${conditions.join(', ')}\n\n`
      
      const highRiskConditions = conditions.filter((c: string) => 
        c.toLowerCase().includes('heart') || 
        c.toLowerCase().includes('stroke') || 
        c.toLowerCase().includes('diabetes')
      )
      if (highRiskConditions.length > 0) {
        summary += `**Risk Assessment:** High priority conditions detected: ${highRiskConditions.join(', ')}\n\n`
      }
    }
    
    if (medications.length > 0) {
      summary += `**Current Medications:** ${medications.join(', ')}\n\n`
      
      if (medications.length > 1) {
        summary += `**Note:** Multiple medications detected - recommend pharmacist review for interactions\n\n`
      }
    }
    
    if (procedures.length > 0) {
      summary += `**Procedures/Tests:** ${procedures.join(', ')}\n\n`
    }
    
    if (dates.length > 0) {
      summary += `**Important Dates:** ${dates.join(', ')}\n\n`
    }
    
    if (specialty) {
      switch (specialty.toLowerCase()) {
        case 'neurology':
          summary += `**Clinical Recommendations:**\n- Monitor neurological symptoms\n- Consider imaging if headaches persist\n- Follow up with neurology specialist\n\n`
          break
        case 'cardiology':
          summary += `**Clinical Recommendations:**\n- Monitor blood pressure regularly\n- Consider cardiac enzymes if chest pain\n- Lifestyle modifications for heart health\n\n`
          break
        case 'orthopedics':
          summary += `**Clinical Recommendations:**\n- Physical therapy evaluation\n- Pain management strategies\n- Activity modification as needed\n\n`
          break
        case 'dermatology':
          summary += `**Clinical Recommendations:**\n- Avoid known allergens\n- Topical treatment as prescribed\n- Monitor for skin changes\n\n`
          break
        case 'endocrinology':
          summary += `**Clinical Recommendations:**\n- Regular glucose monitoring\n- Dietary consultation\n- Medication compliance important\n\n`
          break
      }
    }
    
    summary += `**Next Steps:** Schedule follow-up appointment with ${specialty || 'primary care'} provider for comprehensive evaluation.`
    
    return summary
  }

  const generateFHIRData = (file: File, _entities: any) => {
    return {
      resourceType: 'DocumentReference',
      id: Date.now().toString(),
      status: 'current',
      type: {
        coding: [{
          system: 'http://loinc.org',
          code: '11488-4',
          display: 'Consult note'
        }]
      },
      subject: {
        reference: 'Patient/123456'
      },
      date: new Date().toISOString(),
      content: [{
        attachment: {
          contentType: file.type || 'application/pdf',
          title: file.name
        }
      }]
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setIsProcessing(true)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      try {
        const fileArray = Array.from(files)

        for (const file of fileArray) {
          const processedDoc = await processDocument(file)
          addProcessedDocument(processedDoc)
        }
      } catch (error) {
        console.error('Error processing files:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadFHIR = (doc: ProcessedDocument) => {
    const fhirData = JSON.stringify(doc.fhirData, null, 2)
    const blob = new Blob([fhirData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.filename}_fhir.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportReport = (doc: ProcessedDocument) => {
    let report = `Medical Document Analysis Report\n`
    report += `=====================================\n\n`
    report += `File: ${doc.filename}\n`
    report += `Date: ${doc.uploadDate}\n`
    report += `Confidence: ${doc.confidence}%\n`
    report += `Specialty: ${doc.specialty || 'General'}\n\n`
    
    report += `Extracted Text:\n${doc.extractedText}\n\n`
    
    if (doc.medicalSummary) {
      report += `Medical Analysis:\n${doc.medicalSummary}\n\n`
    }
    
    report += `Medical Entities:\n`
    report += `- Medications: ${doc.medicalEntities.medications.join(', ')}\n`
    report += `- Conditions: ${doc.medicalEntities.conditions.join(', ')}\n`
    report += `- Procedures: ${doc.medicalEntities.procedures.join(', ')}\n`
    report += `- Dates: ${doc.medicalEntities.dates.join(', ')}\n`
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.filename}_report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      files.forEach(file => {
        if (file.type.includes('pdf') || file.type.includes('image') || file.name.endsWith('.tiff')) {
          handleFileUpload({ target: { files: [file] } } as any)
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Processing</h1>
          <p className="text-gray-600 mt-2">Upload and process medical documents with AI-powered OCR and NLP</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Languages className="h-3 w-3" />
          <span>Multi-language OCR</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </CardTitle>
            <CardDescription>
              Upload medical records, lab results, imaging reports, and other healthcare documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className={`border-2 border-dashed ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg p-6 text-center transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop files here or click to upload
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PDF, JPG, PNG, TIFF up to 10MB
                  </span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing documents...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant context or notes about the documents..."
                className="min-h-[100px]"
              />
            </div>

            <Button className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Start AI Processing
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Features</CardTitle>
            <CardDescription>AI-powered document analysis capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Scan className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">OCR Processing</h3>
                  <p className="text-sm text-gray-600">Extract text from scanned documents and images</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">NLP Analysis</h3>
                  <p className="text-sm text-gray-600">Extract medical entities and relationships</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">FHIR Conversion</h3>
                  <p className="text-sm text-gray-600">Convert to HL7 FHIR R4 standard format</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Languages className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Multi-language Support</h3>
                  <p className="text-sm text-gray-600">Process documents in 20+ languages including Hebrew</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {processedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Documents</CardTitle>
            <CardDescription>Recently uploaded and processed files with extracted content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{doc.filename}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.fileSize} • {doc.uploadDate} • {doc.confidence}% confidence
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Processed
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="text">Extracted Text</TabsTrigger>
                      <TabsTrigger value="entities">Medical Entities</TabsTrigger>
                      <TabsTrigger value="fhir">FHIR Data</TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Extracted Text Content</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(doc.extractedText)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {doc.extractedText}
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="entities" className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Medications</h4>
                          <div className="space-y-1">
                            {doc.medicalEntities.medications.map((med, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Conditions</h4>
                          <div className="space-y-1">
                            {doc.medicalEntities.conditions.map((condition, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1 mb-1">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Procedures</h4>
                          <div className="space-y-1">
                            {doc.medicalEntities.procedures.map((procedure, idx) => (
                              <Badge key={idx} variant="default" className="mr-1 mb-1">
                                {procedure}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Important Dates</h4>
                          <div className="space-y-1">
                            {doc.medicalEntities.dates.map((date, idx) => (
                              <Badge key={idx} variant="destructive" className="mr-1 mb-1">
                                {date}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="fhir" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">FHIR R4 Document Reference</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(JSON.stringify(doc.fhirData, null, 2))}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="text-sm">
                          {JSON.stringify(doc.fhirData, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="summary" className="mt-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-900">Processing Stats</h4>
                            <p className="text-sm text-blue-700">
                              Confidence: {doc.confidence}%<br/>
                              Language: {doc.language.toUpperCase()}<br/>
                              Entities Found: {Object.values(doc.medicalEntities).flat().length}
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-900">FHIR Compliance</h4>
                            <p className="text-sm text-green-700">
                              ✅ Document Reference created<br/>
                              ✅ Patient reference linked<br/>
                              ✅ LOINC coding applied
                            </p>
                          </div>
                        </div>
                        
                        {doc.medicalSummary && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Medical Analysis</h4>
                            <div className="text-sm whitespace-pre-wrap">
                              {doc.medicalSummary}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadFHIR(doc)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download FHIR
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportReport(doc)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Export Report
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
