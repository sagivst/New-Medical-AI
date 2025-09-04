import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  Shield, 
  FileText, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react'

interface Claim {
  id: string
  type: string
  amount: string
  status: 'pending' | 'approved' | 'denied' | 'processing'
  submittedDate: string
  provider: string
  description: string
}

export function InsuranceNavigation() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [claimType, setClaimType] = useState('')
  const [amount, setAmount] = useState('')

  const mockClaims: Claim[] = [
    {
      id: 'CLM-001',
      type: 'Medical Consultation',
      amount: '$250.00',
      status: 'approved',
      submittedDate: '2024-01-15',
      provider: 'Dr. Sarah Johnson',
      description: 'Cardiology consultation and ECG'
    },
    {
      id: 'CLM-002',
      type: 'Laboratory Tests',
      amount: '$180.00',
      status: 'processing',
      submittedDate: '2024-01-20',
      provider: 'LabCorp',
      description: 'Blood work and lipid panel'
    },
    {
      id: 'CLM-003',
      type: 'Prescription Medication',
      amount: '$95.00',
      status: 'pending',
      submittedDate: '2024-01-22',
      provider: 'CVS Pharmacy',
      description: 'Monthly prescription refill'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'denied': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'denied': return <AlertCircle className="h-4 w-4" />
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleSubmitClaim = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Navigation</h1>
          <p className="text-gray-600 mt-2">Automated claim processing and appeals generation</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>AI-Powered</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,250</div>
            <p className="text-xs text-muted-foreground">85% approval rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">Average processing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Submit New Claim</span>
            </CardTitle>
            <CardDescription>
              Upload documents and submit insurance claims with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="claim-type">Claim Type</Label>
              <Input
                id="claim-type"
                placeholder="e.g., Medical consultation, Lab tests, Prescription"
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="$0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the medical service or treatment..."
                className="min-h-[100px]"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Upload receipts, medical bills, or supporting documents
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>

            <Button onClick={handleSubmitClaim} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Claim...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Submit Claim
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Features</CardTitle>
            <CardDescription>Automated insurance navigation capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Automated Processing</h3>
                  <p className="text-sm text-gray-600">AI extracts data from medical documents</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Coverage Analysis</h3>
                  <p className="text-sm text-gray-600">Verify coverage and estimate costs</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Appeals Generation</h3>
                  <p className="text-sm text-gray-600">Automatic appeal letters for denials</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Prior Authorization</h3>
                  <p className="text-sm text-gray-600">Streamlined pre-approval process</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
          <CardDescription>Track the status of your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{claim.type}</h3>
                    <Badge className={getStatusColor(claim.status)}>
                      {getStatusIcon(claim.status)}
                      <span className="ml-1 capitalize">{claim.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{claim.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Claim ID: {claim.id}</span>
                    <span>Provider: {claim.provider}</span>
                    <span>Submitted: {claim.submittedDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{claim.amount}</div>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    {claim.status === 'denied' && (
                      <Button size="sm">
                        Appeal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
