import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMedical } from '@/contexts/MedicalContext'
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
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const { getRecommendedSpecialty, getRelevantConditions } = useMedical()

  const allProviders: Provider[] = [
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
      id: '4',
      name: 'Dr. Robert Kim',
      specialty: 'Cardiology',
      rating: 4.8,
      distance: '3.2 miles',
      availability: 'Next available: This week',
      matchScore: 89,
      location: 'Cardiovascular Institute',
      phone: '(555) 456-7890',
      email: 'rkim@cardioinst.com',
      certifications: ['Board Certified Cardiologist', 'Heart Failure Specialist']
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
      id: '5',
      name: 'Dr. Jennifer Walsh',
      specialty: 'Orthopedic Surgery',
      rating: 4.7,
      distance: '2.9 miles',
      availability: 'Next available: Tomorrow',
      matchScore: 91,
      location: 'Joint & Spine Center',
      phone: '(555) 567-8901',
      email: 'jwalsh@jointspine.com',
      certifications: ['Board Certified Orthopedic Surgeon', 'Joint Replacement']
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
    },
    {
      id: '6',
      name: 'Dr. David Park',
      specialty: 'Endocrinology',
      rating: 4.6,
      distance: '3.5 miles',
      availability: 'Next available: Next week',
      matchScore: 87,
      location: 'Metabolic Health Clinic',
      phone: '(555) 678-9012',
      email: 'dpark@metabolic.com',
      certifications: ['Board Certified Endocrinologist', 'Thyroid Specialist']
    },
    {
      id: '7',
      name: 'Dr. Amanda Wilson',
      specialty: 'Dermatology',
      rating: 4.8,
      distance: '2.1 miles',
      availability: 'Next available: Tomorrow',
      matchScore: 93,
      location: 'Skin Health Center',
      phone: '(555) 789-0123',
      email: 'awilson@skinhealth.com',
      certifications: ['Board Certified Dermatologist', 'Mohs Surgery']
    },
    {
      id: '8',
      name: 'Dr. Lisa Thompson',
      specialty: 'Dermatology',
      rating: 4.7,
      distance: '3.8 miles',
      availability: 'Next available: This week',
      matchScore: 89,
      location: 'Advanced Dermatology',
      phone: '(555) 890-1234',
      email: 'lthompson@advderm.com',
      certifications: ['Board Certified Dermatologist', 'Cosmetic Dermatology']
    },
    {
      id: '9',
      name: 'Dr. James Wilson',
      specialty: 'Neurology',
      rating: 4.9,
      distance: '2.7 miles',
      availability: 'Next available: Tomorrow',
      matchScore: 94,
      location: 'Neurological Associates',
      phone: '(555) 901-2345',
      email: 'jwilson@neuroassoc.com',
      certifications: ['Board Certified Neurologist', 'Headache Specialist']
    },
    {
      id: '10',
      name: 'Dr. Maria Santos',
      specialty: 'Neurology',
      rating: 4.8,
      distance: '4.3 miles',
      availability: 'Next available: This week',
      matchScore: 90,
      location: 'Brain & Spine Institute',
      phone: '(555) 012-3456',
      email: 'msantos@brainspine.com',
      certifications: ['Board Certified Neurologist', 'Epilepsy Specialist']
    }
  ]

  useEffect(() => {
    const recommendedSpecialty = getRecommendedSpecialty()
    const relevantConditions = getRelevantConditions()
    
    if (recommendedSpecialty) {
      setSpecialty(recommendedSpecialty)
      
      if (relevantConditions.length > 0) {
        setSearchQuery(relevantConditions[0])
      }
    }
    
    filterProviders()
  }, [getRecommendedSpecialty, getRelevantConditions])

  const filterProviders = () => {
    let filtered = allProviders
    
    if (specialty) {
      filtered = filtered.filter(provider => {
        const providerSpecialty = provider.specialty.toLowerCase()
        const selectedSpecialty = specialty.toLowerCase()
        
        if (selectedSpecialty === 'orthopedics' && providerSpecialty.includes('orthopedic')) {
          return true
        }
        if (selectedSpecialty === 'cardiology' && providerSpecialty.includes('cardiology')) {
          return true
        }
        if (selectedSpecialty === 'endocrinology' && providerSpecialty.includes('endocrinology')) {
          return true
        }
        if (selectedSpecialty === 'neurology' && providerSpecialty.includes('neurology')) {
          return true
        }
        if (selectedSpecialty === 'dermatology' && providerSpecialty.includes('dermatology')) {
          return true
        }
        
        return providerSpecialty.includes(selectedSpecialty)
      })
    }
    
    if (searchQuery) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.certifications.some(cert => 
          cert.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    const recommendedSpecialty = getRecommendedSpecialty()
    if (recommendedSpecialty) {
      filtered = filtered.map(provider => {
        const providerSpecialty = provider.specialty.toLowerCase()
        const recommended = recommendedSpecialty.toLowerCase()
        
        if ((recommended === 'orthopedics' && providerSpecialty.includes('orthopedic')) ||
            (recommended === 'cardiology' && providerSpecialty.includes('cardiology')) ||
            (recommended === 'endocrinology' && providerSpecialty.includes('endocrinology')) ||
            (recommended === 'neurology' && providerSpecialty.includes('neurology')) ||
            (recommended === 'dermatology' && providerSpecialty.includes('dermatology'))) {
          return { ...provider, matchScore: Math.min(provider.matchScore + 10, 99) }
        }
        return provider
      })
    }
    
    filtered.sort((a, b) => b.matchScore - a.matchScore)
    
    setFilteredProviders(filtered)
  }

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      filterProviders()
      setIsSearching(false)
    }, 1500)
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
          <div>
            <h2 className="text-xl font-semibold">Recommended Providers</h2>
            {getRecommendedSpecialty() && (
              <p className="text-sm text-blue-600 mt-1">
                🤖 AI-filtered based on your processed medical documents ({getRecommendedSpecialty()})
              </p>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {(filteredProviders.length > 0 ? filteredProviders : allProviders.slice(0, 3)).map((provider) => (
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
