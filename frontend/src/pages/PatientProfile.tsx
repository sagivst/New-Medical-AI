import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Shield,
  FileText,
  Heart,
  Pill,
  AlertTriangle,
  Languages,
  Globe
} from 'lucide-react'

export function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [language, setLanguage] = useState('en')

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'he', name: 'עברית' },
    { code: 'ar', name: 'العربية' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'pt', name: 'Português' }
  ]

  const medicalConditions = [
    'Hypertension',
    'Type 2 Diabetes',
    'High Cholesterol'
  ]

  const medications = [
    { name: 'Lisinopril', dosage: '10mg daily', prescriber: 'Dr. Johnson' },
    { name: 'Metformin', dosage: '500mg twice daily', prescriber: 'Dr. Smith' },
    { name: 'Atorvastatin', dosage: '20mg daily', prescriber: 'Dr. Johnson' }
  ]

  const allergies = [
    'Penicillin',
    'Shellfish',
    'Latex'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal and medical information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Multi-language</span>
          </Badge>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Your basic demographic and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue="John"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue="Doe"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@email.com"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      defaultValue="(555) 123-4567"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      defaultValue="1985-06-15"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-gray-400" />
                    <Select value={language} onValueChange={setLanguage} disabled={!isEditing}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    defaultValue="123 Main Street, Anytown, ST 12345"
                    disabled={!isEditing}
                    className="flex-1 min-h-[60px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Medical History</span>
              </CardTitle>
              <CardDescription>Your medical conditions and health information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Medical Conditions</Label>
                <div className="flex flex-wrap gap-2">
                  {medicalConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Condition
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Medications</Label>
                <div className="space-y-2">
                  {medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-600">{med.dosage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Prescribed by {med.prescriber}</p>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="mt-1">
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="w-full">
                      Add Medication
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-sm">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {allergy}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Allergy
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Insurance Information</span>
              </CardTitle>
              <CardDescription>Your insurance coverage details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  defaultValue="Blue Cross Blue Shield"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  defaultValue="BCBS123456789"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  defaultValue="GRP001"
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>FHIR Data</span>
              </CardTitle>
              <CardDescription>Your standardized health data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Patient Resource</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Condition Resources</span>
                <Badge variant="outline">{medicalConditions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medication Resources</span>
                <Badge variant="outline">{medications.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AllergyIntolerance</span>
                <Badge variant="outline">{allergies.length}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Export FHIR Bundle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Your data protection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HIPAA Compliance</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Encryption</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  AES-256
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Logs</span>
                <Badge variant="outline">Available</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
