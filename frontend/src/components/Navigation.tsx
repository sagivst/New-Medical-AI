import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Shield, 
  User, 
  Home,
  Stethoscope,
  Globe
} from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/providers', label: 'Find Providers', icon: Users },
    { path: '/insurance', label: 'Insurance', icon: Shield },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Medical Blitzy AI</span>
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
