import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, 
  FileText, 
  Image, 
  Scan,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Languages
} from 'lucide-react'

export function DocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setIsProcessing(true)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsProcessing(false)
            setUploadedFiles(prev => [...prev, ...Array.from(files).map(f => f.name)])
            return 100
          }
          return prev + 10
        })
      }, 200)
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

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Documents</CardTitle>
            <CardDescription>Recently uploaded and processed files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((filename, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{filename}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Processed
                    </Badge>
                    <Button variant="outline" size="sm">
                      View FHIR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
