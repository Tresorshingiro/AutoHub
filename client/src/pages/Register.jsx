import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Car,
  Mail, 
  Lock, 
  User, 
  Building,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Check,
  ArrowLeft
} from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Owner Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Garage Information
    garageName: '',
    garageAddress: '',
    garagePhone: '',
    garageEmail: '',
    
    // Plan Selection
    selectedPlan: 'professional', // Default to professional plan
    
    // Terms
    acceptTerms: false,
    acceptNewsletter: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        return
      }

      if (!formData.acceptTerms) {
        toast.error('Please accept the terms and conditions')
        return
      }

      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Account created successfully! Check your email to verify your account.')
      
      // Redirect to login or dashboard
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const plans = [
    { id: 'starter', name: 'Starter', price: '$29', popular: false },
    { id: 'professional', name: 'Professional', price: '$79', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: '$199', popular: false }
  ]

  const features = [
    "14-day free trial",
    "No setup fees",
    "Cancel anytime",
    "24/7 support",
    "Secure & reliable"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
            <Car className="h-8 w-8 text-garage-green" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AutoHub
            </span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Your{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Free Trial
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of garage owners who trust AutoHub to manage their business. 
            Get started with a 14-day free trial.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>
                  Fill in your details to get started with AutoHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+250 788 123 456"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Garage Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Garage Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="garageName" className="block text-sm font-medium mb-2">
                          Garage Name *
                        </label>
                        <Input
                          id="garageName"
                          name="garageName"
                          type="text"
                          required
                          value={formData.garageName}
                          onChange={handleInputChange}
                          placeholder="AutoFix Garage"
                        />
                      </div>
                      <div>
                        <label htmlFor="garagePhone" className="block text-sm font-medium mb-2">
                          Garage Phone
                        </label>
                        <Input
                          id="garagePhone"
                          name="garagePhone"
                          type="tel"
                          value={formData.garagePhone}
                          onChange={handleInputChange}
                          placeholder="+250 788 123 456"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="garageAddress" className="block text-sm font-medium mb-2">
                        Garage Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="garageAddress"
                          name="garageAddress"
                          type="text"
                          required
                          value={formData.garageAddress}
                          onChange={handleInputChange}
                          placeholder="KG 15 Ave, Nyarugenge, Kigali"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-garage-green hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-garage-green hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptNewsletter"
                        name="acceptNewsletter"
                        checked={formData.acceptNewsletter}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <label htmlFor="acceptNewsletter" className="text-sm text-muted-foreground">
                        Send me updates about AutoHub features and tips (optional)
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="cta" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Start My Free Trial'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-garage-green hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Plan Summary & Features */}
          <div className="space-y-6">
            {/* Selected Plan */}
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Professional Plan Selected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">RF100,000</span>
                  <Badge className="bg-garage-green text-white">Most Popular</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  per month, billed monthly
                </p>
                <div className="text-sm">
                  <p className="font-medium text-garage-green">14-day free trial included</p>
                  <p className="text-muted-foreground">No credit card required</p>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-garage-green mr-3" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is here to help you get started with AutoHub.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Chat with Support
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
