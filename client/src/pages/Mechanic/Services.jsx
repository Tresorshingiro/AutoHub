import React, { useEffect, useState } from 'react'
import { useMechanic } from '../../context/MechanicContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Wrench, 
  Search, 
  Eye, 
  CheckCircle,
  Play,
  Clock,
  User,
  Calendar,
  Car,
  X,
  Settings,
  Activity
} from 'lucide-react'

const MechanicServices = () => {
  const { 
    quotations,
    services,
    loading,
    fetchQuotations,
    fetchServices,
    startService,
    updateServiceProgress,
    completeService
  } = useMechanic()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)

  useEffect(() => {
    fetchQuotations()
    fetchServices()
  }, [])

  // Filter approved quotations (ready to start service) - exclude those with existing services
  const approvedQuotations = quotations.filter(q => {
    const hasService = services.some(service => 
      service.quotationId === q._id || service.quotationId?._id === q._id
    )
    
    const matchesSearch = !searchTerm || 
      q.vehicleId?.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehicleId?.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return q.status === 'approved' && !hasService && matchesSearch
  })

  // Filter active services (exclude completed ones)
  const activeServices = services.filter(s => {
    const isActive = ['started', 'in-progress'].includes(s.overallStatus)
    
    const matchesSearch = !searchTerm ||
      s.vehicleId?.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleId?.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.serviceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return isActive && matchesSearch
  })

  const handleStartService = async (quotationId) => {
    try {
      await startService(quotationId)
      fetchQuotations()
      fetchServices()
    } catch (error) {
      console.error('Error starting service:', error)
    }
  }

  const handleCompleteService = async (serviceId) => {
    try {
      await completeService(serviceId, { serviceNotes: 'Service completed by mechanic' })
      fetchServices()
      setShowServiceModal(false)
      setSelectedService(null)
    } catch (error) {
      console.error('Error completing service:', error)
    }
  }

  const handleUpdateProgress = async (serviceId, progress) => {
    try {
      console.log('Updating progress:', serviceId, progress)
      
      // Validate progress
      const progressNumber = parseInt(progress)
      if (isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
        alert('Please enter a valid progress percentage between 0 and 100')
        return
      }

      const result = await updateServiceProgress(serviceId, { progress: progressNumber })
      console.log('Progress update result:', result)
      
      // Refresh services and update selected service
      await fetchServices()
      
      // Update the selected service in the modal
      const updatedServices = await fetchServices()
      const updatedService = updatedServices?.find(s => s._id === serviceId)
      if (updatedService) {
        setSelectedService(updatedService)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Failed to update progress: ' + (error.message || error))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'started': return 'bg-blue-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  // Quotation Detail Modal
  const QuotationModal = () => {
    if (!showQuotationModal || !selectedQuotation) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Quotation Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowQuotationModal(false)
                setSelectedQuotation(null)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Brand:</strong> {selectedQuotation.vehicleId?.vehicleBrand}</p>
                <p><strong>Type:</strong> {selectedQuotation.vehicleId?.vehicleType}</p>
                <p><strong>Plate:</strong> {selectedQuotation.vehicleId?.PlateNo}</p>
                <p><strong>Year:</strong> {selectedQuotation.vehicleId?.year}</p>
                <p><strong>Engine:</strong> {selectedQuotation.vehicleId?.engineType}</p>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {selectedQuotation.vehicleId?.customer?.name}</p>
                <p><strong>Phone:</strong> {selectedQuotation.vehicleId?.customer?.phoneNumber}</p>
                <p><strong>Email:</strong> {selectedQuotation.vehicleId?.customer?.email}</p>
                <p><strong>Address:</strong> {selectedQuotation.vehicleId?.customer?.address}</p>
              </CardContent>
            </Card>
          </div>

          {/* Parts & Services */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Approved Services & Parts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Item</th>
                      <th className="border border-gray-300 p-2 text-left">Type</th>
                      <th className="border border-gray-300 p-2 text-right">Quantity</th>
                      <th className="border border-gray-300 p-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.parts?.map((part, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{part.partId?.name}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge variant="outline">Part</Badge>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">{part.quantity}</td>
                        <td className="border border-gray-300 p-2 text-right">
                          RWF {part.unitPrice?.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          RWF {part.totalPrice?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {selectedQuotation.services?.map((service, index) => (
                      <tr key={`service-${index}`}>
                        <td className="border border-gray-300 p-2">{service.serviceName}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge variant="outline">Service</Badge>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">1</td>
                        <td className="border border-gray-300 p-2 text-right">
                          RWF {service.servicePrice?.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          RWF {service.servicePrice?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right space-y-2">
                <p><strong>Subtotal:</strong> RWF {selectedQuotation.summary?.subtotal?.toLocaleString()}</p>
                <p><strong>Tax:</strong> RWF {selectedQuotation.summary?.tax?.toLocaleString()}</p>
                <p className="text-lg"><strong>Grand Total:</strong> RWF {selectedQuotation.summary?.grandTotal?.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowQuotationModal(false)
                setSelectedQuotation(null)
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => handleStartService(selectedQuotation._id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Service
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Service Detail Modal
  const ServiceModal = () => {
    if (!showServiceModal || !selectedService) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Service Progress</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowServiceModal(false)
                setSelectedService(null)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>Service Number:</strong> {selectedService.serviceNumber}</p>
                <p><strong>Vehicle:</strong> {selectedService.vehicleId?.vehicleBrand} {selectedService.vehicleId?.vehicleType}</p>
                <p><strong>Plate:</strong> {selectedService.vehicleId?.PlateNo}</p>
                <p><strong>Started:</strong> {new Date(selectedService.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center space-x-2">
                  <span><strong>Status:</strong></span>
                  <Badge className={`${getStatusColor(selectedService.overallStatus)} text-white`}>
                    {selectedService.overallStatus}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span><strong>Progress:</strong></span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${selectedService.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{selectedService.progress || 0}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Service Progress Update */}
            <Card>
              <CardHeader>
                <CardTitle>Update Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Progress: {selectedService.progress || 0}%
                    </label>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${selectedService.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter new progress percentage (0-100)"
                    min="0"
                    max="100"
                    defaultValue={selectedService.progress || 0}
                    id="progress-input"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        const progressInput = document.getElementById('progress-input')
                        const progress = progressInput.value
                        if (progress !== '') {
                          handleUpdateProgress(selectedService._id, progress)
                        } else {
                          alert('Please enter a progress value')
                        }
                      }}
                      variant="outline"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                    <Button
                      onClick={() => handleCompleteService(selectedService._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowServiceModal(false)
                setSelectedService(null)
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Start and manage vehicle services</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={fetchQuotations} variant="outline">
            <Wrench className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by vehicle, plate number, or quotation number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved Quotations - Ready to Start Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Ready to Start Service ({approvedQuotations.length})
            </CardTitle>
            <CardDescription>Approved quotations ready to begin service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {approvedQuotations.map((quotation) => (
                <div key={quotation._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{quotation.quotationNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {quotation.vehicleId?.vehicleBrand} {quotation.vehicleId?.vehicleType}
                      </p>
                      <p className="text-sm text-gray-500">{quotation.vehicleId?.PlateNo}</p>
                      <p className="text-sm font-medium text-green-600">
                        Total: RWF {quotation.summary?.grandTotal?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500 text-white">Approved</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuotation(quotation)
                          setShowQuotationModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartService(quotation._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {approvedQuotations.length === 0 && (
                <p className="text-gray-500 text-center py-8">No approved quotations ready for service</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Active Services ({activeServices.length})
            </CardTitle>
            <CardDescription>Services currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeServices.map((service) => (
                <div key={service._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{service.serviceNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {service.vehicleId?.vehicleBrand} {service.vehicleId?.vehicleType}
                      </p>
                      <p className="text-sm text-gray-500">{service.vehicleId?.PlateNo}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${service.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{service.progress || 0}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(service.overallStatus)} text-white`}>
                        {service.overallStatus}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedService(service)
                          setShowServiceModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {activeServices.length === 0 && (
                <p className="text-gray-500 text-center py-8">No active services</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <QuotationModal />
      <ServiceModal />
    </div>
  )
}

export default MechanicServices
