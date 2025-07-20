import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReceptionContext } from '@/context/ReceptionContext'
import { 
  CheckCircle, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  User,
  Phone,
  Mail,
  Wrench,
  Trophy,
  FileText
} from 'lucide-react'

const ClearedVehicles = () => {
  const { vehicles, getAllVehicles } = useContext(ReceptionContext)
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

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
      vehicle.status === 'completed'
    )

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.PlateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ChassisNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    setFilteredVehicles(filtered)
  }, [vehicles, searchTerm])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateServiceDuration = (createdAt, updatedAt) => {
    const start = new Date(createdAt)
    const end = new Date(updatedAt)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading cleared vehicles...</span>
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            Cleared Vehicles
          </h1>
          <p className="text-muted-foreground mt-1">
            View all completed vehicle services
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filteredVehicles.length}</div>
            <div className="text-sm text-muted-foreground">Total Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredVehicles.filter(v => 
                new Date(v.updatedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredVehicles.length > 0 
                ? Math.round(filteredVehicles.reduce((acc, v) => 
                    acc + calculateServiceDuration(v.createdAt, v.updatedAt), 0
                  ) / filteredVehicles.length)
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredVehicles.filter(v => 
                new Date(v.updatedAt) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search completed vehicles by plate number, brand, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cleared Vehicles List */}
      <div className="space-y-4">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <Card key={vehicle._id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
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
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                          {vehicle.vehicleBrand} {vehicle.vehicleType}
                          <Trophy className="h-5 w-5 text-green-600" />
                        </h3>
                        <p className="text-muted-foreground">
                          {vehicle.ModelYear} • Plate: {vehicle.PlateNo}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {calculateServiceDuration(vehicle.createdAt, vehicle.updatedAt)} days service
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
                        <span>Started: {formatDate(vehicle.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Completed: {formatDate(vehicle.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span>Engine: {vehicle.engine}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Original Concerns:
                        </p>
                        <p className="text-sm text-green-700">{vehicle.concerns}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Service Details:</p>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>Insurance: {vehicle.insurance}</p>
                          <p>TIN: {vehicle.TinNo}</p>
                          <p>Chassis: {vehicle.ChassisNo}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? 'No completed vehicles found' : 'No completed services yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Completed vehicle services will appear here'
                }
              </p>
              {!searchTerm && (
                <Button variant="outline">
                  <Wrench className="h-4 w-4 mr-2" />
                  View In Service
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ClearedVehicles
