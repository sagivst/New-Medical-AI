import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Users, 
  Shield, 
  CheckCircle,
  TrendingUp,
  Globe,
  BarChart3
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMedical } from '@/contexts/MedicalContext'

export function Dashboard() {
  const { processedDocuments, getRecommendedSpecialty } = useMedical()
  const hasProcessedDocuments = processedDocuments.length > 0
  const recommendedSpecialty = getRecommendedSpecialty()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Medical Blitzy AI</h1>
          <p className="text-gray-600 mt-2">Your integrated health navigator with AI-powered assistance</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Globe className="h-3 w-3" />
          <span>Multi-language Support</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FHIR Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">HL7 FHIR R4 compliant</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest healthcare interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Medical record uploaded</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <Badge variant="outline">Processed</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Provider match found</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Insurance claim submitted</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/documents">
                <FileText className="mr-2 h-4 w-4" />
                Upload Medical Documents
              </Link>
            </Button>
            {hasProcessedDocuments && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/documents">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Medical Analysis ({recommendedSpecialty || 'General'})
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/providers">
                <Users className="mr-2 h-4 w-4" />
                Find Healthcare Providers
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/insurance">
                <Shield className="mr-2 h-4 w-4" />
                Navigate Insurance Claims
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>AI-Powered Features</span>
          </CardTitle>
          <CardDescription>Advanced capabilities powered by artificial intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Document Processing</h3>
              <p className="text-sm text-gray-600 mb-3">OCR and NLP analysis of medical documents with FHIR conversion</p>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">95% accuracy rate</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Provider Matching</h3>
              <p className="text-sm text-gray-600 mb-3">ML algorithms for optimal healthcare provider recommendations</p>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">88% match success rate</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Multi-language Support</h3>
              <p className="text-sm text-gray-600 mb-3">20+ languages including Hebrew RTL support</p>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Full language coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
