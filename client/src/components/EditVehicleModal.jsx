import React, { useState, useContext } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ReceptionContext } from '@/context/ReceptionContext'
import { AuthContext } from '@/context/AuthContext'
import { Car, Upload, User, Phone, Mail, FileText, Calendar, Hash, Settings, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const EditVehicleModal = ({ vehicle, trigger }) => {
  const { getAllVehicles } = useContext(ReceptionContext)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(vehicle?.image || null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [formData, setFormData] = useState({
    vehicleBrand: vehicle?.vehicleBrand || '',
    vehicleType: vehicle?.vehicleType || '',
    ModelYear: vehicle?.ModelYear || '',
    PlateNo: vehicle?.PlateNo || '',
    ChassisNo: vehicle?.ChassisNo || '',
    engine: vehicle?.engine || '',
    customer: {
      name: vehicle?.customer?.name || '',
      email: vehicle?.customer?.email || '',
      phone: vehicle?.customer?.phone || ''
    },
    insurance: vehicle?.insurance || '',
    TinNo: vehicle?.TinNo || '',
    concerns: vehicle?.concerns || '',
    status: vehicle?.status || 'awaiting-diagnosis'
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

      // Create FormData
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'customer') {
          // Send customer as JSON string for FormData
          submitData.append('customer', JSON.stringify(formData.customer))
        } else {
          submitData.append(key, formData[key])
        }
      })
      
      // Add image only if a new one was selected
      if (image) {
        submitData.append('image', image)
      }

      // Get token based on user role
      const tokenRole = user.role === 'receptionist' ? 'reception' : user.role
      const token = localStorage.getItem(`${tokenRole}Token`)
      
      const response = await axios.patch(
        `${backendUrl}/api/reception/update-vehicle/${vehicle._id}`,
        submitData,
        {
          headers: {
            'rtoken': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success('Vehicle updated successfully!')
        setOpen(false)
        await getAllVehicles() // Refresh the vehicles list
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error(error.response?.data?.message || 'Failed to update vehicle')
    }
    
    setLoading(false)
  }

  if (!vehicle) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Edit className="h-6 w-6 text-white" />
            </div>
            Edit Vehicle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Information
            </h3>
            <div className="space-y-4">
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
                <label className="text-sm font-medium">Vehicle Image</label>
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
                          PNG, JPG up to 10MB (optional)
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
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Customer Information
            </h3>
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
          </div>

          {/* Service Details */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Service Details
            </h3>
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
                  <span>Updating...</span>
                </div>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Vehicle
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditVehicleModal
