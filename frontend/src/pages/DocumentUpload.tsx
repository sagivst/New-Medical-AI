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

export function DocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const { processedDocuments, addProcessedDocument } = useMedical()

  const simulateOCRProcessing = (file: File): Promise<ProcessedDocument> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scenarios = [
          {
            specialty: 'Cardiology',
            patient: 'John Doe',
            dob: '01/15/1980',
            mrn: 'MRN-123456',
            complaint: 'chest pain and shortness of breath',
            history: '45-year-old male with a history of hypertension and diabetes mellitus type 2 presents with acute onset chest pain that started 2 hours ago. Pain is described as crushing, substernal, radiating to left arm. Associated with diaphoresis and nausea.',
            medications: ['Metformin 500mg twice daily', 'Lisinopril 10mg once daily', 'Aspirin 81mg once daily'],
            conditions: ['Hypertension', 'Diabetes mellitus type 2', 'Acute coronary syndrome'],
            procedures: ['ECG', 'Cardiac enzymes', 'Chest X-ray'],
            plan: 'Acute coronary syndrome - rule out myocardial infarction\n   - Order ECG, cardiac enzymes, chest X-ray\n   - Start heparin protocol\n   - Cardiology consultation',
            followup: 'Patient to follow up with cardiology within 1 week.',
            doctor: 'Dr. Sarah Johnson, MD\nInternal Medicine'
          },
          {
            specialty: 'Orthopedics',
            patient: 'Maria Garcia',
            dob: '03/22/1985',
            mrn: 'MRN-789012',
            complaint: 'knee pain and difficulty walking',
            history: '38-year-old female presents with progressive right knee pain for 3 weeks following a fall while jogging. Pain is worse with weight bearing and stairs. No previous knee injuries.',
            medications: ['Ibuprofen 400mg as needed', 'Acetaminophen 500mg twice daily'],
            conditions: ['Right knee contusion', 'Possible meniscal tear', 'Joint effusion'],
            procedures: ['Knee X-ray', 'MRI knee', 'Physical examination'],
            plan: 'Right knee injury - rule out meniscal tear\n   - Order MRI of right knee\n   - Physical therapy referral\n   - Orthopedic surgery consultation',
            followup: 'Patient to follow up with orthopedics in 2 weeks.',
            doctor: 'Dr. Michael Chen, MD\nOrthopedic Surgery'
          },
          {
            specialty: 'Endocrinology',
            patient: 'Robert Smith',
            dob: '07/10/1972',
            mrn: 'MRN-345678',
            complaint: 'increased thirst, frequent urination, and fatigue',
            history: '51-year-old male presents with 2-month history of polyuria, polydipsia, and fatigue. Family history of diabetes mellitus type 2. Recent weight loss of 15 pounds.',
            medications: ['Multivitamin daily'],
            conditions: ['Diabetes mellitus type 2 (newly diagnosed)', 'Hyperglycemia', 'Metabolic syndrome'],
            procedures: ['HbA1c', 'Fasting glucose', 'Lipid panel', 'Comprehensive metabolic panel'],
            plan: 'Newly diagnosed diabetes mellitus type 2\n   - Start metformin 500mg twice daily\n   - Diabetes education referral\n   - Endocrinology consultation',
            followup: 'Patient to follow up with endocrinology in 1 month.',
            doctor: 'Dr. Emily Rodriguez, MD\nEndocrinology'
          },
          {
            specialty: 'Dermatology',
            patient: 'Lisa Johnson',
            dob: '11/05/1990',
            mrn: 'MRN-567890',
            complaint: 'skin rash and itching',
            history: '33-year-old female presents with 1-week history of pruritic rash on arms and legs. No known allergies. Recently started new laundry detergent.',
            medications: ['Benadryl 25mg as needed', 'Hydrocortisone cream 1% topical'],
            conditions: ['Contact dermatitis', 'Allergic reaction', 'Eczematous dermatitis'],
            procedures: ['Skin examination', 'Patch testing', 'Allergy consultation'],
            plan: 'Contact dermatitis - likely allergic reaction\n   - Discontinue new laundry detergent\n   - Continue topical hydrocortisone\n   - Dermatology follow-up if no improvement',
            followup: 'Patient to follow up with dermatology in 2 weeks if symptoms persist.',
            doctor: 'Dr. Amanda Wilson, MD\nDermatology'
          },
          {
            specialty: 'Neurology',
            patient: 'David Brown',
            dob: '09/18/1965',
            mrn: 'MRN-234567',
            complaint: 'headaches and dizziness',
            history: '58-year-old male presents with 3-week history of severe headaches and intermittent dizziness. Headaches are worse in the morning and associated with nausea.',
            medications: ['Sumatriptan 50mg as needed', 'Propranolol 40mg twice daily'],
            conditions: ['Migraine headaches', 'Tension headaches', 'Rule out secondary headache'],
            procedures: ['Brain MRI', 'CT head', 'Neurological examination'],
            plan: 'Chronic headaches - rule out secondary causes\n   - Order brain MRI with contrast\n   - Neurology consultation\n   - Headache diary',
            followup: 'Patient to follow up with neurology in 1 week.',
            doctor: 'Dr. James Wilson, MD\nNeurology'
          }
        ]

        let selectedScenario = scenarios[0] // default to cardiology
        const fileName = file.name.toLowerCase()
        
        if (fileName.includes('ortho') || fileName.includes('knee') || fileName.includes('bone')) {
          selectedScenario = scenarios[1]
        } else if (fileName.includes('diabetes') || fileName.includes('sugar') || fileName.includes('endocr')) {
          selectedScenario = scenarios[2]
        } else if (fileName.includes('skin') || fileName.includes('rash') || fileName.includes('derm')) {
          selectedScenario = scenarios[3]
        } else if (fileName.includes('head') || fileName.includes('neuro') || fileName.includes('brain')) {
          selectedScenario = scenarios[4]
        } else {
          selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
        }

        const mockExtractedText = `
MEDICAL RECORD - ${file.name.toUpperCase()}

Patient: ${selectedScenario.patient}
Date of Birth: ${selectedScenario.dob}
Medical Record Number: ${selectedScenario.mrn}

CHIEF COMPLAINT:
Patient presents with ${selectedScenario.complaint}.

HISTORY OF PRESENT ILLNESS:
${selectedScenario.history}

MEDICATIONS:
${selectedScenario.medications.map(med => `- ${med}`).join('\n')}

ASSESSMENT AND PLAN:
1. ${selectedScenario.plan}

FOLLOW-UP:
${selectedScenario.followup}

${selectedScenario.doctor}
License: MD-${Math.floor(Math.random() * 900000) + 100000}
        `.trim()

        const processedDoc: ProcessedDocument = {
          id: Date.now().toString(),
          filename: file.name,
          fileType: file.type || 'application/pdf',
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: new Date().toLocaleDateString(),
          extractedText: mockExtractedText,
          medicalEntities: {
            medications: selectedScenario.medications,
            conditions: selectedScenario.conditions,
            procedures: selectedScenario.procedures,
            dates: [selectedScenario.dob, 'Today', '1-2 weeks']
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
          language: 'en',
          specialty: selectedScenario.specialty
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

        for (const file of fileArray) {
          const processedDoc = await simulateOCRProcessing(file)
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
