import React, { useEffect, useState } from 'react'
import { useMechanic } from '../../context/MechanicContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  CheckCircle, 
  Search, 
  Eye, 
  User,
  Calendar,
  Car,
  X,
  DollarSign,
  Clock,
  Download,
  FileText
} from 'lucide-react'

const CompletedVehicles = () => {
  const { vehicles, loading, fetchAssignedVehicles } = useMechanic()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showVehicleModal, setShowVehicleModal] = useState(false)

  useEffect(() => {
    fetchAssignedVehicles()
  }, [])

  useEffect(() => {
    // Filter completed vehicles
    let filtered = vehicles?.filter(vehicle => 
      vehicle.status === 'completed' || vehicle.status === 'service-completed'
    ) || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(vehicle => 
            vehicle.completedAt && new Date(vehicle.completedAt) >= filterDate
          )
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(vehicle => 
            vehicle.completedAt && new Date(vehicle.completedAt) >= filterDate
          )
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(vehicle => 
            vehicle.completedAt && new Date(vehicle.completedAt) >= filterDate
          )
          break
        default:
          break
      }
    }

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt))

    setFilteredVehicles(filtered)
  }, [vehicles, searchTerm, dateFilter])

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleModal(true)
  }

  const calculateServiceDuration = (vehicle) => {
    if (!vehicle.completedAt) return 'N/A'
    
    const startDate = new Date(vehicle.createdAt)
    const endDate = new Date(vehicle.completedAt)
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day'
    return `${diffDays} days`
  }

  // Vehicle Details Modal
  const VehicleModal = () => {
    if (!showVehicleModal || !selectedVehicle) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Completed Vehicle Details</h2>
              <p className="text-gray-600">{selectedVehicle.vehicleBrand} {selectedVehicle.vehicleType}</p>
            </div>
            <Button variant="ghost" onClick={() => setShowVehicleModal(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Completion Status */}
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Service Completed Successfully</span>
              </div>
              <p className="text-green-700 mt-1">
                Completed on: {selectedVehicle.completedAt 
                  ? new Date(selectedVehicle.completedAt).toLocaleDateString()
                  : new Date(selectedVehicle.updatedAt).toLocaleDateString()
                }
              </p>
            </div>

            {/* Service Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Service Duration</div>
                <div className="font-semibold">{calculateServiceDuration(selectedVehicle)}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="font-semibold">
                  {new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(selectedVehicle.totalAmount || 0)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Payment Status</div>
                <div className="font-semibold">
                  <Badge variant={
                    selectedVehicle.paymentStatus === 'paid' ? 'default' :
                    selectedVehicle.paymentStatus === 'partially-paid' ? 'secondary' :
                    'destructive'
                  }>
                    {selectedVehicle.paymentStatus?.replace('-', ' ') || 'unpaid'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Brand & Type</label>
                  <p className="font-medium">{selectedVehicle.vehicleBrand} {selectedVehicle.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Model Year</label>
                  <p className="font-medium">{selectedVehicle.ModelYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Plate Number</label>
                  <p className="font-medium">{selectedVehicle.PlateNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Chassis Number</label>
                  <p className="font-medium">{selectedVehicle.ChassisNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Engine</label>
                  <p className="font-medium">{selectedVehicle.engine}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Insurance</label>
                  <p className="font-medium">{selectedVehicle.insurance}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="font-medium">{selectedVehicle.customer?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="font-medium">{selectedVehicle.customer?.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="font-medium">{selectedVehicle.customer?.email}</p>
                </div>
              </div>
            </div>

            {/* Service Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Service Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium">Vehicle Arrived</div>
                    <div className="text-sm text-gray-600">
                      {new Date(selectedVehicle.createdAt).toLocaleDateString()} - 
                      Customer reported concerns
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium">Diagnosis Completed</div>
                    <div className="text-sm text-gray-600">
                      Quotation created and approved by customer
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium">Service Started</div>
                    <div className="text-sm text-gray-600">
                      Repair work commenced on approved quotation
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-green-800">Service Completed</div>
                    <div className="text-sm text-green-600">
                      {selectedVehicle.completedAt 
                        ? new Date(selectedVehicle.completedAt).toLocaleDateString()
                        : new Date(selectedVehicle.updatedAt).toLocaleDateString()
                      } - Vehicle ready for pickup
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Concerns */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Original Customer Concerns</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>{selectedVehicle.concerns}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVehicleModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading completed vehicles...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Completed Vehicles</h1>
          <p className="text-gray-600">View all successfully completed vehicle services</p>
        </div>
        <Button onClick={fetchAssignedVehicles} variant="outline">
          <CheckCircle className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredVehicles.length}
              </div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {vehicles?.filter(v => 
                  (v.status === 'completed' || v.status === 'service-completed') && 
                  v.completedAt && 
                  new Date(v.completedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length || 0}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {vehicles?.filter(v => 
                  (v.status === 'completed' || v.status === 'service-completed') && 
                  v.completedAt && 
                  new Date(v.completedAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length || 0}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredVehicles.reduce((avg, vehicle) => {
                  const duration = Math.ceil((new Date(vehicle.completedAt || vehicle.updatedAt) - new Date(vehicle.createdAt)) / (1000 * 60 * 60 * 24))
                  return avg + duration
                }, 0) / (filteredVehicles.length || 1)}
              </div>
              <div className="text-sm text-gray-600">Avg. Duration (days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by vehicle, plate number, or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {vehicle.vehicleBrand} {vehicle.vehicleType}
                </CardTitle>
                <Badge className="bg-green-500 text-white">
                  Completed
                </Badge>
              </div>
              <CardDescription>
                Plate: {vehicle.PlateNo} | Year: {vehicle.ModelYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{vehicle.customer?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Completed: {vehicle.completedAt 
                    ? new Date(vehicle.completedAt).toLocaleDateString()
                    : new Date(vehicle.updatedAt).toLocaleDateString()
                  }</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Duration: {calculateServiceDuration(vehicle)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Amount: {new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(vehicle.totalAmount || 0)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Payment:</span>
                <Badge variant={
                  vehicle.paymentStatus === 'paid' ? 'default' :
                  vehicle.paymentStatus === 'partially-paid' ? 'secondary' :
                  'destructive'
                }>
                  {vehicle.paymentStatus?.replace('-', ' ') || 'unpaid'}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-3">
                <Button 
                  onClick={() => handleViewVehicle(vehicle)}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No vehicles message */}
      {filteredVehicles.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No completed vehicles found</h3>
            <p className="text-gray-600">
              {searchTerm || dateFilter !== 'all'
                ? 'Try adjusting your search criteria or date filter'
                : 'No vehicles have been completed yet'
              }
            </p>
            {(searchTerm || dateFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setDateFilter('all')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vehicle Modal */}
      <VehicleModal />
    </div>
  )
}

export default CompletedVehicles
