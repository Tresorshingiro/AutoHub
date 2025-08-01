import React, { useState, useContext } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AuthContext } from '@/context/AuthContext'
import { Car, Eye, EyeOff, UserCheck, Shield, Crown, Calculator, Wrench, Phone } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'reception'
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const roles = [
    { value: 'reception', label: 'Receptionist', icon: Phone, color: 'text-blue-600' },
    { value: 'mechanic', label: 'Mechanic', icon: Wrench, color: 'text-green-600' },
    { value: 'accountant', label: 'Accountant', icon: Calculator, color: 'text-purple-600' },
    { value: 'manager', label: 'Manager', icon: UserCheck, color: 'text-orange-600' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    const credentials = {
      email: formData.email,
      password: formData.password
    }

    const success = await login(formData.role, credentials)
    
    // Redirect based on role after successful login
    if (success) {
      switch (formData.role) {
        case 'reception':
          navigate('/reception/dashboard')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'mechanic':
          navigate('/mechanic/dashboard')
          break
        case 'accountant':
          navigate('/accountant/dashboard')
          break
        case 'manager':
          navigate('/manager/dashboard')
          break
        default:
          navigate('/')
      }
    }
  }

  const currentRole = roles.find(role => role.value === formData.role)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gray-100/5 bg-[radial-gradient(circle_at_1px_1px,_gray_1px,_transparent_0)] bg-[length:60px_60px]"></div>
      </div>

      {/* Back to home link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-700 hover:text-garage-green transition-colors duration-300 z-10"
      >
        <Car className="h-8 w-8 text-garage-green" />
        <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">AutoHub</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-elegant border-0 bg-background/95 backdrop-blur-lg">
          <CardHeader className="text-center space-y-4">
            {/* Role indicator */}
            <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
              <currentRole.icon className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to your AutoHub account as{" "}
                <span className={`font-semibold ${currentRole.color}`}>
                  {currentRole.label}
                </span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  Select Role
                </label>
                <Select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="transition-all duration-300 focus:shadow-glow"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="transition-all duration-300 focus:shadow-glow"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10 transition-all duration-300 focus:shadow-glow"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300 hover:scale-105"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-garage-green hover:underline font-medium">
              Contact your administrator
            </a>
          </p>
          <div className="pt-2 border-t border-gray-200">
            <Link 
              to="/admin-login"
              className="text-sm text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center"
            >
              <Crown className="h-4 w-4 mr-1" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
