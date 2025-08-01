import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { 
  Car, 
  Plus, 
  LayoutDashboard, 
  Wrench, 
  CheckCircle, 
  LogOut, 
  User,
  Menu,
  X,
  FileText,
  DollarSign,
  Package,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Role-based menu items
  const getMenuItems = () => {
    switch (user?.role) {
      case 'receptionist':
        return [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/reception/dashboard',
            color: 'text-blue-600'
          },
          {
            title: 'Add Vehicle',
            icon: Plus,
            path: '/reception/add-vehicle',
            color: 'text-green-600'
          },
          {
            title: 'In Service',
            icon: Wrench,
            path: '/reception/in-service',
            color: 'text-orange-600'
          },
          {
            title: 'Cleared Vehicles',
            icon: CheckCircle,
            path: '/reception/cleared',
            color: 'text-purple-600'
          }
        ]
      
      case 'mechanic':
        return [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/mechanic/dashboard',
            color: 'text-blue-600'
          },
          {
            title: 'Diagnosis',
            icon: Car,
            path: '/mechanic/diagnosis',
            color: 'text-yellow-600'
          },
          {
            title: 'Quotations',
            icon: FileText,
            path: '/mechanic/quotations',
            color: 'text-orange-600'
          },
          {
            title: 'Services',
            icon: Wrench,
            path: '/mechanic/services',
            color: 'text-purple-600'
          },
          {
            title: 'Completed',
            icon: CheckCircle,
            path: '/mechanic/completed',
            color: 'text-green-600'
          }
        ]
      
      case 'accountant':
        return [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/accountant/dashboard',
            color: 'text-blue-600'
          },
          {
            title: 'Cleared Vehicles',
            icon: CheckCircle,
            path: '/accountant/cleared-vehicles',
            color: 'text-green-600'
          },
          {
            title: 'Income',
            icon: DollarSign,
            path: '/accountant/income',
            color: 'text-green-600'
          },
          {
            title: 'Expenses',
            icon: FileText,
            path: '/accountant/expenses',
            color: 'text-red-600'
          },
          {
            title: 'Inventory',
            icon: Package,
            path: '/accountant/inventory',
            color: 'text-purple-600'
          },
          {
            title: 'Suppliers',
            icon: Users,
            path: '/accountant/suppliers',
            color: 'text-orange-600'
          },
          {
            title: 'Reports',
            icon: BarChart3,
            path: '/accountant/reports',
            color: 'text-indigo-600'
          }
        ]

      case 'manager':
        return [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/manager/dashboard',
            color: 'text-blue-600'
          },
          {
            title: 'Employees',
            icon: Users,
            path: '/manager/employees',
            color: 'text-green-600'
          },
          {
            title: 'Payroll',
            icon: DollarSign,
            path: '/manager/payroll',
            color: 'text-yellow-600'
          },
          {
            title: 'Operations',
            icon: Settings,
            path: '/manager/operations',
            color: 'text-purple-600'
          },
          {
            title: 'Reports',
            icon: BarChart3,
            path: '/manager/reports',
            color: 'text-indigo-600'
          }
        ]

      case 'admin':
        return [
          {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
            color: 'text-blue-600'
          },
          {
            title: 'Employees',
            icon: Users,
            path: '/admin/employees',
            color: 'text-green-600'
          },
          {
            title: 'Reports',
            icon: BarChart3,
            path: '/admin/reports',
            color: 'text-indigo-600'
          }
        ]
      
      default:
        return []
    }
  }

  const menuItems = getMenuItems()
  
  const getRoleName = () => {
    switch (user?.role) {
      case 'receptionist':
        return 'Reception Panel'
      case 'mechanic':
        return 'Mechanic Panel'
      case 'accountant':
        return 'Accountant Panel'
      case 'manager':
        return 'Manager Panel'
      case 'admin':
        return 'Admin Panel'
      default:
        return 'Dashboard'
    }
  }

  const isActive = (path) => location.pathname === path

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AutoHub</h1>
            <p className="text-sm text-muted-foreground">{getRoleName()}</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.firstName || 'User'} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.firstName 
                ? user.firstName
                : user?.role === 'manager' ? 'Manager'
                : user?.role === 'receptionist' ? 'Receptionist'
                : user?.role === 'mechanic' ? 'Mechanic'
                : user?.role === 'accountant' ? 'Accountant'
                : 'User'
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              {user?.email || `${user?.role || 'user'}@autohub.com`}
            </p>
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-primary-foreground' : item.color}`} />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        className="lg:hidden fixed top-4 left-4 z-50"
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-background border-r flex-col h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed left-0 top-0 h-screen w-64 bg-background border-r z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar
