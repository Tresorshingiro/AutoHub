import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReceptionContext } from '@/context/ReceptionContext'
import ViewVehicleModal from '@/components/ViewVehicleModal'
import EditVehicleModal from '@/components/EditVehicleModal'
import { 
  Wrench, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

const InService = () => {
  const { vehicles, getAllVehicles } = useContext(ReceptionContext)
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6) // 6 vehicles per page for better layout

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      await getAllVehicles()
      setLoading(false)
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    let filtered = vehicles.filter(vehicle => 
      vehicle.status !== 'completed'
    )

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.PlateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ChassisNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter)
    }

    setFilteredVehicles(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [vehicles, searchTerm, statusFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  const getStatusColor = (status) => {
    switch (status) {
      case 'awaiting-diagnosis':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'waiting-parts':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'awaiting-diagnosis':
        return <AlertCircle className="h-4 w-4" />
      case 'in-progress':
        return <Wrench className="h-4 w-4" />
      case 'waiting-parts':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const statusCounts = {
    all: vehicles.filter(v => v.status !== 'completed').length,
    'awaiting-diagnosis': vehicles.filter(v => v.status === 'awaiting-diagnosis').length,
    'in-progress': vehicles.filter(v => v.status === 'in-progress').length,
    'waiting-parts': vehicles.filter(v => v.status === 'waiting-parts').length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading vehicles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            Vehicles In Service
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor vehicles currently being serviced
          </p>
        </div>
        <Link to="/reception/add-vehicle">
          <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
            Add New Vehicle
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
            <div className="text-sm text-muted-foreground">Total In Service</div>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === 'awaiting-diagnosis' ? 'ring-2 ring-yellow-500' : ''}`}
              onClick={() => setStatusFilter('awaiting-diagnosis')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts['awaiting-diagnosis']}</div>
            <div className="text-sm text-muted-foreground">Awaiting Diagnosis</div>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === 'in-progress' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setStatusFilter('in-progress')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts['in-progress']}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === 'waiting-parts' ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setStatusFilter('waiting-parts')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts['waiting-parts']}</div>
            <div className="text-sm text-muted-foreground">Waiting Parts</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by plate number, brand, customer name, or chassis number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={statusFilter !== 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter !== 'all' ? 'Clear Filter' : 'All Status'}
            </Button>
          </div>
          
          {/* Pagination Info */}
          {filteredVehicles.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicles List */}
      <div className="space-y-4">
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <Card key={vehicle._id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Vehicle Image */}
                  <div className="w-full lg:w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {vehicle.image ? (
                      <img 
                        src={vehicle.image} 
                        alt={`${vehicle.vehicleBrand} ${vehicle.vehicleType}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                        <Wrench className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {vehicle.vehicleBrand} {vehicle.vehicleType}
                        </h3>
                        <p className="text-muted-foreground">
                          {vehicle.ModelYear} • Plate: {vehicle.PlateNo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-1 ${getStatusColor(vehicle.status)}`}>
                          {getStatusIcon(vehicle.status)}
                          {formatStatus(vehicle.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Added: {formatDate(vehicle.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span>Engine: {vehicle.engine}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Chassis: {vehicle.ChassisNo}</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Service Concerns:</p>
                      <p className="text-sm">{vehicle.concerns}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <ViewVehicleModal 
                      vehicle={vehicle}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      }
                    />
                    <EditVehicleModal 
                      vehicle={vehicle}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No vehicles found' : 'No vehicles in service'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'All vehicles have been completed or none have been added yet'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/reception/add-vehicle">
                  <Button>Add First Vehicle</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = pageNum === 1 || 
                                 pageNum === totalPages || 
                                 Math.abs(pageNum - currentPage) <= 1
                  
                  if (!showPage && pageNum === 2 && currentPage > 4) {
                    return <span key="start-ellipsis" className="px-2 py-1">...</span>
                  }
                  if (!showPage && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return <span key="end-ellipsis" className="px-2 py-1">...</span>
                  }
                  if (!showPage) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="px-3 py-1 min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default InService