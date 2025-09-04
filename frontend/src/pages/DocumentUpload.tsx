import React, { useState } from 'react'
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
  Image, 
  Scan,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Languages,
  Eye,
  Download,
  Copy
} from 'lucide-react'

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
}

export function DocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null)

  const simulateOCRProcessing = (file: File): Promise<ProcessedDocument> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockExtractedText = `
MEDICAL RECORD - ${file.name.toUpperCase()}

Patient: John Doe
Date of Birth: 01/15/1980
Medical Record Number: MRN-123456

CHIEF COMPLAINT:
Patient presents with chest pain and shortness of breath.

HISTORY OF PRESENT ILLNESS:
45-year-old male with a history of hypertension and diabetes mellitus type 2 presents with acute onset chest pain that started 2 hours ago. Pain is described as crushing, substernal, radiating to left arm. Associated with diaphoresis and nausea.

MEDICATIONS:
- Metformin 500mg twice daily
- Lisinopril 10mg once daily
- Aspirin 81mg once daily

ASSESSMENT AND PLAN:
1. Acute coronary syndrome - rule out myocardial infarction
   - Order ECG, cardiac enzymes, chest X-ray
   - Start heparin protocol
   - Cardiology consultation

2. Diabetes mellitus type 2 - continue current medications
3. Hypertension - well controlled on current regimen

FOLLOW-UP:
Patient to follow up with cardiology within 1 week.

Dr. Sarah Johnson, MD
Internal Medicine
License: MD-789012
        `.trim()

        const processedDoc: ProcessedDocument = {
          id: Date.now().toString(),
          filename: file.name,
          fileType: file.type || 'application/pdf',
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: new Date().toLocaleDateString(),
          extractedText: mockExtractedText,
          medicalEntities: {
            medications: ['Metformin 500mg', 'Lisinopril 10mg', 'Aspirin 81mg'],
            conditions: ['Hypertension', 'Diabetes mellitus type 2', 'Acute coronary syndrome'],
            procedures: ['ECG', 'Cardiac enzymes', 'Chest X-ray'],
            dates: ['01/15/1980', '2 hours ago', '1 week']
          },
          fhirData: {
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
          },
          confidence: Math.floor(Math.random() * 10) + 90,
          language: 'en'
        }

        resolve(processedDoc)
      }, 2000)
    })
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
        setUploadedFiles(prev => [...prev, ...fileArray.map(f => f.name)])

        for (const file of fileArray) {
          const processedDoc = await simulateOCRProcessing(file)
          setProcessedDocuments(prev => [...prev, processedDoc])
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                        onClick={() => setSelectedDocument(doc)}
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
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download FHIR
                          </Button>
                          <Button variant="outline" size="sm">
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
