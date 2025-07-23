import React, { useEffect, useState } from 'react'
import { useMechanic } from '../../context/MechanicContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Car, 
  Wrench, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Settings,
  Package,
  TrendingUp,
  Edit,
  Play,
  Pause
} from 'lucide-react'

const MechanicDashboard = () => {
  const { 
    dashboard, 
    loading, 
    fetchDashboard,
    updateVehicleStatus,
    startService,
    updateQuotationStatus,
    updateServiceProgress
  } = useMechanic()

  const [serviceProgressModal, setServiceProgressModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [progressValue, setProgressValue] = useState(0)
  const [waitingPartsModal, setWaitingPartsModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [partsNotes, setPartsNotes] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  // Check if quotation already has a service
  const hasExistingService = (quotationId) => {
    return dashboard?.recentActivity?.services?.some(service => 
      service.quotationId === quotationId || service.quotationId?._id === quotationId
    )
  }

  // Check if service is completed
  const isServiceCompleted = (quotationId) => {
    return dashboard?.recentActivity?.services?.some(service => 
      (service.quotationId === quotationId || service.quotationId?._id === quotationId) &&
      service.overallStatus === 'completed'
    )
  }

  const handleStartService = async (quotationId) => {
    if (hasExistingService(quotationId)) {
      alert('Service already exists for this quotation')
      return
    }
    
    try {
      await startService(quotationId)
      fetchDashboard() // Refresh dashboard after starting service
    } catch (error) {
      console.error('Failed to start service:', error)
    }
  }

  const handleServiceProgressUpdate = (service) => {
    setSelectedService(service)
    setProgressValue(service.progress || 0)
    setServiceProgressModal(true)
  }

  const submitProgressUpdate = async () => {
    try {
      // Validate progress
      if (progressValue < 0 || progressValue > 100) {
        alert('Progress must be between 0 and 100')
        return
      }

      await updateServiceProgress(selectedService._id, { progress: progressValue })
      setServiceProgressModal(false)
      setSelectedService(null)
      setProgressValue(0)
      fetchDashboard() // Refresh dashboard
    } catch (error) {
      console.error('Failed to update progress:', error)
      alert('Failed to update progress: ' + (error.message || error))
    }
  }

  const handleWaitingPartsUpdate = (vehicle) => {
    setSelectedVehicle(vehicle)
    setPartsNotes('')
    setWaitingPartsModal(true)
  }

  const submitWaitingPartsUpdate = async () => {
    try {
      await updateVehicleStatus(selectedVehicle._id, 'waiting-parts', partsNotes)
      setWaitingPartsModal(false)
      setSelectedVehicle(null)
      setPartsNotes('')
      fetchDashboard() // Refresh dashboard
    } catch (error) {
      console.error('Failed to update vehicle status:', error)
    }
  }

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">No dashboard data available</div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'awaiting-diagnosis': return 'bg-yellow-500'
      case 'quotation-pending': return 'bg-amber-500'
      case 'quotation-approved': return 'bg-green-500'
      case 'quotation-rejected': return 'bg-red-500'
      case 'in-progress': return 'bg-blue-500'
      case 'waiting-parts': return 'bg-orange-500'
      case 'completed': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getQuotationStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mechanic Dashboard</h1>
          <p className="text-gray-600">Monitor your work progress and manage vehicle services</p>
        </div>
        <Button onClick={fetchDashboard} variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.totalVehiclesAssigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.activeServices}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Quotations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.pendingQuotations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Quotations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.approvedQuotations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.summary.lowStockAlerts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Vehicle Status Distribution
          </CardTitle>
          <CardDescription>Current status of all assigned vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Awaiting Diagnosis</span>
              <Badge variant="outline">{dashboard.vehicleStats.awaitingDiagnosis}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-sm">Quotation Pending</span>
              <Badge variant="outline">{dashboard.vehicleStats.quotationPending || 0}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Quotation Approved</span>
              <Badge variant="outline">{dashboard.vehicleStats.quotationApproved || 0}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">In Progress</span>
              <Badge variant="outline">{dashboard.vehicleStats.inProgress}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Waiting Parts</span>
              <Badge variant="outline">{dashboard.vehicleStats.waitingParts}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Recent Vehicles
            </CardTitle>
            <CardDescription>Latest vehicles assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentActivity.vehicles?.slice(0, 5).map((vehicle) => (
                <div key={vehicle._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{vehicle.vehicleBrand} {vehicle.vehicleType}</p>
                    <p className="text-sm text-gray-600">{vehicle.PlateNo}</p>
                    <p className="text-xs text-gray-500">Customer: {vehicle.customer?.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                      {vehicle.status.replace('-', ' ')}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleWaitingPartsUpdate(vehicle)}
                      title="Mark as waiting for parts"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!dashboard.recentActivity.vehicles?.length && (
                <p className="text-gray-500 text-center py-4">No recent vehicles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Quotations
            </CardTitle>
            <CardDescription>Your latest quotation activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentActivity.quotations?.slice(0, 5).map((quotation) => (
                <div key={quotation._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{quotation.quotationNumber}</p>
                    <p className="text-sm text-gray-600">
                      {quotation.vehicleId?.vehicleBrand} {quotation.vehicleId?.vehicleType}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: RWF {quotation.summary?.grandTotal?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getQuotationStatusColor(quotation.status)} text-white`}>
                      {quotation.status}
                    </Badge>
                    {quotation.status === 'approved' && !hasExistingService(quotation._id) && (
                      <Button 
                        size="sm"
                        onClick={() => handleStartService(quotation._id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start Service
                      </Button>
                    )}
                    {quotation.status === 'approved' && hasExistingService(quotation._id) && !isServiceCompleted(quotation._id) && (
                      <Badge variant="outline" className="text-blue-600">
                        Service In Progress
                      </Badge>
                    )}
                    {quotation.status === 'approved' && isServiceCompleted(quotation._id) && (
                      <Badge variant="outline" className="text-green-600">
                        Service Completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {!dashboard.recentActivity.quotations?.length && (
                <p className="text-gray-500 text-center py-4">No recent quotations</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Active Services
            </CardTitle>
            <CardDescription>Services currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentActivity.services?.slice(0, 5).map((service) => (
                <div key={service._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{service.serviceNumber}</p>
                    <p className="text-sm text-gray-600">
                      {service.vehicleId?.vehicleBrand} {service.vehicleId?.vehicleType}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${service.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{service.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{service.overallStatus}</Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleServiceProgressUpdate(service)}
                      title="Update progress"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!dashboard.recentActivity.services?.length && (
                <p className="text-gray-500 text-center py-4">No active services</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Parts that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.alerts.lowStockParts?.slice(0, 5).map((part) => (
                <div key={part._id} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                  <div>
                    <p className="font-medium">{part.name}</p>
                    <p className="text-sm text-gray-600">{part.partNumber}</p>
                    <p className="text-xs text-red-600">
                      Stock: {part.inventory?.currentStock} / Min: {part.inventory?.minimumStock}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low Stock
                  </Badge>
                </div>
              ))}
              {!dashboard.alerts.lowStockParts?.length && (
                <p className="text-gray-500 text-center py-4">No low stock alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Progress Modal */}
      {serviceProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Update Service Progress</h3>
              <p className="text-sm text-gray-600">{selectedService?.serviceNumber}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Progress Percentage
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  placeholder="Enter progress percentage (0-100)"
                />
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setServiceProgressModal(false)}>
                Cancel
              </Button>
              <Button onClick={submitProgressUpdate}>
                Update Progress
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting Parts Modal */}
      {waitingPartsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Mark Vehicle as Waiting for Parts</h3>
              <p className="text-sm text-gray-600">
                {selectedVehicle?.vehicleBrand} {selectedVehicle?.vehicleType} - {selectedVehicle?.PlateNo}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows="4"
                  value={partsNotes}
                  onChange={(e) => setPartsNotes(e.target.value)}
                  placeholder="Add notes about which parts are needed..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setWaitingPartsModal(false)}>
                Cancel
              </Button>
              <Button onClick={submitWaitingPartsUpdate} className="bg-orange-600 hover:bg-orange-700">
                Mark as Waiting Parts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MechanicDashboard
