import React, { useEffect, useState, useCallback } from 'react'
import { useMechanic } from '../../context/MechanicContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Car, 
  Search, 
  Eye, 
  FileText, 
  User,
  Calendar,
  Phone,
  Mail,
  Settings,
  ClipboardList,
  X
} from 'lucide-react'
import QuotationModal from './QuotationModal'

const Diagnosis = () => {
  const { 
    vehicles, 
    parts,
    loading, 
    fetchAssignedVehicles,
    createQuotation,
    fetchAllParts
  } = useMechanic()

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  useEffect(() => {
    console.log('Diagnosis component mounted, fetching data...')
    fetchAssignedVehicles()
    fetchAllParts()
  }, [])

  useEffect(() => {
    console.log('Vehicles data updated:', vehicles)
    if (!vehicles) {
      setFilteredVehicles([])
      return
    }
    
    let filtered = vehicles.filter(vehicle => 
      vehicle.status === 'awaiting-diagnosis' || vehicle.status === 'waiting-parts'
    )
    console.log('Filtered vehicles (awaiting-diagnosis + waiting-parts):', filtered)

    if (searchTerm && searchTerm.trim().length > 0) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleBrand?.toLowerCase().includes(searchLower) ||
        vehicle.vehicleType?.toLowerCase().includes(searchLower) ||
        vehicle.PlateNo?.toLowerCase().includes(searchLower) ||
        vehicle.customer?.name?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredVehicles(filtered)
  }, [vehicles, searchTerm])

  const handleViewVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleModal(true)
  }, [])

  const handleCreateQuotation = useCallback((vehicle) => {
    setSelectedVehicle(vehicle)
    setShowQuotationModal(true)
  }, [])

  const handleQuotationSubmit = useCallback(async (quotationData) => {
    try {
      console.log('Submitting quotation with data:', quotationData)
      const result = await createQuotation(selectedVehicle._id, quotationData)
      console.log('Quotation creation result:', result)
      setShowQuotationModal(false)
      setSelectedVehicle(null)
      fetchAssignedVehicles() // Refresh the list
    } catch (error) {
      console.error('Failed to create quotation:', error)
      alert('Failed to create quotation: ' + (error.message || error))
    }
  }, [selectedVehicle, createQuotation, fetchAssignedVehicles])

  // Vehicle Details Modal
  const VehicleModal = () => {
    if (!showVehicleModal || !selectedVehicle) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vehicle Details</h2>
            <Button variant="ghost" onClick={() => setShowVehicleModal(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
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

            {/* Concerns */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Concerns</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>{selectedVehicle.concerns}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVehicleModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowVehicleModal(false)
              handleCreateQuotation(selectedVehicle)
            }}>
              Create Quotation
            </Button>
          </div>
        </div>
      </div>
    )
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vehicles...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Diagnosis & Parts Quotation</h1>
          <p className="text-gray-600">Create quotations for vehicles awaiting diagnosis or waiting for parts</p>
        </div>
        <Button onClick={fetchAssignedVehicles} variant="outline">
          <Car className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by vehicle, plate number, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {vehicle.vehicleBrand} {vehicle.vehicleType}
                </CardTitle>
                <Badge className="bg-yellow-500 text-white">
                  Awaiting Diagnosis
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
                  <Car className="w-4 h-4 mr-2" />
                  <span>Chassis: {vehicle.ChassisNo}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Engine: {vehicle.engine}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{vehicle.customer?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{vehicle.customer?.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Arrived: {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Concerns Preview */}
              <div className="border-t pt-3">
                <div className="flex items-start text-sm text-gray-600">
                  <ClipboardList className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="line-clamp-2">{vehicle.concerns}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-3 flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewVehicle(vehicle)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  onClick={() => handleCreateQuotation(vehicle)}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Quotation
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
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'No vehicles are currently awaiting diagnosis'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <VehicleModal />
      <QuotationModal 
        show={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        vehicle={selectedVehicle}
        parts={parts}
        onSubmit={handleQuotationSubmit}
      />
    </div>
  )
}

export default Diagnosis
