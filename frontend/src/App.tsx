import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/Navigation'
import { Dashboard } from '@/pages/Dashboard'
import { DocumentUpload } from '@/pages/DocumentUpload'
import { ProviderSearch } from '@/pages/ProviderSearch'
import { InsuranceNavigation } from '@/pages/InsuranceNavigation'
import { PatientProfile } from '@/pages/PatientProfile'
import { MedicalProvider } from '@/contexts/MedicalContext'
import './App.css'

function App() {
  return (
    <MedicalProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentUpload />} />
              <Route path="/providers" element={<ProviderSearch />} />
              <Route path="/insurance" element={<InsuranceNavigation />} />
              <Route path="/profile" element={<PatientProfile />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </MedicalProvider>
  )
}

export default App
