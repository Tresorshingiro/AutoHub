import React, { useState, useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AuthContext } from '@/context/AuthContext'
import { Car, Upload, User, Phone, Mail, FileText, Calendar, Hash, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const AddVehicle = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [formData, setFormData] = useState({
    vehicleBrand: '',
    vehicleType: '',
    ModelYear: '',
    PlateNo: '',
    ChassisNo: '',
    engine: '',
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    insurance: '',
    TinNo: '',
    concerns: '',
    status: 'awaiting-diagnosis'
  })

  const vehicleBrands = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 
    'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Other'
  ]

  const vehicleTypes = [
    'Sedan', 'SUV', 'Hatchback', 'Pickup Truck', 'Coupe', 'Convertible', 
    'Wagon', 'Minivan', 'Crossover', 'Sports Car', 'Luxury Car', 'Other'
  ]

  const statusOptions = [
    { value: 'awaiting-diagnosis', label: 'Awaiting Diagnosis' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'waiting-parts', label: 'Waiting for Parts' },
    { value: 'completed', label: 'Completed' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          [customerField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.vehicleBrand || !formData.vehicleType || !formData.ModelYear || 
          !formData.PlateNo || !formData.ChassisNo || !formData.engine || 
          !formData.insurance || !formData.TinNo || !formData.concerns) {
        toast.error('Please fill in all vehicle fields')
        setLoading(false)
        return
      }

      if (!formData.customer.name || !formData.customer.email || !formData.customer.phone) {
        toast.error('Please fill in all customer details')
        setLoading(false)
        return
      }

      if (!image) {
        toast.error('Please upload a vehicle image')
        setLoading(false)
        return
      }

      // Create FormData
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'customer') {
          submitData.append('customer', JSON.stringify(formData.customer))
        } else {
          submitData.append(key, formData[key])
        }
      })
      
      // Add image
      submitData.append('image', image)

      // Get token
      const token = localStorage.getItem('receptionToken')
      
      const response = await axios.post(
        `${backendUrl}/api/reception/add-vehicle`,
        submitData,
        {
          headers: {
            'rtoken': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success('Vehicle added successfully!')
        
        // Reset form
        setFormData({
          vehicleBrand: '',
          vehicleType: '',
          ModelYear: '',
          PlateNo: '',
          ChassisNo: '',
          engine: '',
          customer: {
            name: '',
            email: '',
            phone: ''
          },
          insurance: '',
          TinNo: '',
          concerns: '',
          status: 'awaiting-diagnosis'
        })
        setImage(null)
        setImagePreview(null)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      toast.error(error.response?.data?.message || 'Failed to add vehicle')
    }
    
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Vehicle</h1>
            <p className="text-muted-foreground">Register a new vehicle for service</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Brand *</label>
                <Select
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {vehicleBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type *</label>
                <Select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Model Year *</label>
                <Input
                  name="ModelYear"
                  value={formData.ModelYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Plate Number *</label>
                <Input
                  name="PlateNo"
                  value={formData.PlateNo}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC-123D"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chassis Number *</label>
                <Input
                  name="ChassisNo"
                  value={formData.ChassisNo}
                  onChange={handleInputChange}
                  placeholder="Enter chassis number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Engine *</label>
                <Input
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.0L Turbo"
                  required
                />
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Image *</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Vehicle preview" 
                      className="mx-auto h-48 w-auto rounded-lg object-cover"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        Upload Vehicle Image
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name *</label>
                <Input
                  name="customer.name"
                  value={formData.customer.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address *</label>
                <Input
                  name="customer.email"
                  type="email"
                  value={formData.customer.email}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  name="customer.phone"
                  value={formData.customer.phone}
                  onChange={handleInputChange}
                  placeholder="+250 xxx xxx xxx"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Insurance *</label>
                <Input
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  placeholder="Insurance company"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">TIN Number *</label>
                <Input
                  name="TinNo"
                  value={formData.TinNo}
                  onChange={handleInputChange}
                  placeholder="Tax identification number"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Service Status</label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Concerns/Issues *</label>
              <textarea
                name="concerns"
                value={formData.concerns}
                onChange={handleInputChange}
                placeholder="Describe the vehicle issues or service requirements..."
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-garage-green focus:border-transparent"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Adding Vehicle...</span>
              </div>
            ) : (
              <>
                <Car className="h-4 w-4 mr-2" />
                Add Vehicle
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddVehicle