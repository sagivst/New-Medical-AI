import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  MapPin, 
  Star, 
  Users,
  Clock,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Filter
} from 'lucide-react'

interface Provider {
  id: string
  name: string
  specialty: string
  rating: number
  distance: string
  availability: string
  matchScore: number
  location: string
  phone: string
  email: string
  certifications: string[]
}

export function ProviderSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.9,
      distance: '2.3 miles',
      availability: 'Next available: Tomorrow',
      matchScore: 95,
      location: 'Heart Center Medical Group',
      phone: '(555) 123-4567',
      email: 'sjohnson@heartcenter.com',
      certifications: ['Board Certified Cardiologist', 'Interventional Cardiology']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic Surgery',
      rating: 4.8,
      distance: '4.1 miles',
      availability: 'Next available: Next week',
      matchScore: 88,
      location: 'Orthopedic Specialists',
      phone: '(555) 234-5678',
      email: 'mchen@orthospec.com',
      certifications: ['Board Certified Orthopedic Surgeon', 'Sports Medicine']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Endocrinology',
      rating: 4.7,
      distance: '1.8 miles',
      availability: 'Next available: This week',
      matchScore: 92,
      location: 'Diabetes & Endocrine Center',
      phone: '(555) 345-6789',
      email: 'erodriguez@endocenter.com',
      certifications: ['Board Certified Endocrinologist', 'Diabetes Specialist']
    }
  ]

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Healthcare Providers</h1>
          <p className="text-gray-600 mt-2">AI-powered provider matching based on your medical needs</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>AI Matching</span>
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Criteria</span>
          </CardTitle>
          <CardDescription>
            Enter your preferences to find the best healthcare providers for your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedic Surgery</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Terms</Label>
              <Input
                id="search"
                placeholder="Condition, procedure, or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Searching with AI...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Providers
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended Providers</h2>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {mockProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {provider.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{provider.specialty}</p>
                  <p className="text-sm text-gray-500 mb-3">{provider.location}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{provider.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{provider.availability}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{provider.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm">
                    Book Appointment
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    Reviews
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
