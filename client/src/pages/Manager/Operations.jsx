import React, { useState, useEffect } from 'react'
import { useManager } from '../../context/ManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { 
  Activity,
  Car,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Wrench,
  FileText,
  Calendar,
  BarChart3,
  RefreshCw,
  Settings,
  Bell,
  Target,
  Search,
  Filter,
  DollarSign,
  Eye
} from 'lucide-react'

const ManagerOperations = () => {
  const { 
    operationsData, 
    employees,
    loading, 
    fetchOperationsData,
    fetchEmployees
  } = useManager()

  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOperationsData()
    fetchEmployees()
  }, [])

  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchOperationsData()
      }, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, fetchOperationsData])

  // Process real data
  const vehicles = operationsData?.vehicles || []
  const mechanics = employees?.filter(emp => emp.role === 'mechanic') || []
  const receptionists = employees?.filter(emp => emp.role === 'receptionist') || []
  const efficiency = operationsData?.efficiency || {}
  const mechanicWorkload = operationsData?.mechanicWorkload || []
  const statusDistribution = operationsData?.statusDistribution || []

  // Calculate metrics from real data
  const activeVehicles = vehicles.filter(v => v.status !== 'completed' && v.status !== 'cleared').length
  const completedToday = vehicles.filter(v => {
    const today = new Date().toDateString()
    return v.updatedAt && new Date(v.updatedAt).toDateString() === today && v.status === 'completed'
  }).length

  const totalRevenue = vehicles
    .filter(v => v.status === 'completed' || v.status === 'cleared')
    .reduce((sum, v) => sum + (v.totalAmount || 0), 0)

  // Filter vehicles for display
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_service': return 'bg-blue-100 text-blue-800'
      case 'pending_quotation': return 'bg-yellow-100 text-yellow-800'
      case 'quotation_sent': return 'bg-purple-100 text-purple-800'
      case 'diagnosis': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cleared': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_service': return 'In Service'
      case 'pending_quotation': return 'Pending Quote'
      case 'quotation_sent': return 'Quote Sent'
      case 'diagnosis': return 'Diagnosis'
      case 'completed': return 'Completed'
      case 'cleared': return 'Cleared'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring and performance analytics</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button 
              onClick={() => {
                fetchOperationsData()
                fetchEmployees()
              }} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">{activeVehicles}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Currently in service
                  </p>
                </div>
                <Car className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Service Time</p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {efficiency.averageServiceTime || '0'}h
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Based on completed jobs
                  </p>
                </div>
                <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{completedToday}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Vehicles finished
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl lg:text-2xl font-bold text-purple-600">
                    {totalRevenue.toLocaleString()} RWF
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    From completed vehicles
                  </p>
                </div>
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Status & Team Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Status Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vehicle Status Distribution</CardTitle>
              <CardDescription>Real-time vehicle distribution across service stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusDistribution.map((status) => {
                  const total = statusDistribution.reduce((sum, s) => sum + s.count, 0)
                  const percentage = total > 0 ? (status.count / total) * 100 : 0
                  
                  return (
                    <div key={status._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{getStatusLabel(status._id)}</span>
                        <span className="text-sm text-gray-600">{status.count} vehicles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300 bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
                {statusDistribution.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No vehicle data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Current staff status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Mechanics</p>
                      <p className="text-xs text-gray-600">Active on duty</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{mechanics.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Reception</p>
                      <p className="text-xs text-gray-600">Customer service</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">{receptionists.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Efficiency</p>
                      <p className="text-xs text-gray-600">Overall performance</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {efficiency.completedVehicles && efficiency.totalVehicles ? 
                      Math.round((efficiency.completedVehicles / efficiency.totalVehicles) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Vehicles</CardTitle>
            <CardDescription>All vehicles currently in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by plate, brand, customer name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Statuses</option>
                <option value="awaiting-diagnosis">In Service</option>
                <option value="pending_quotation">Pending Quotation</option>
                <option value="quotation_sent">Quotation Sent</option>
                <option value="diagnosis">Diagnosis</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600">Plate No.</th>
                    <th className="text-left p-3 font-medium text-gray-600">Vehicle</th>
                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.slice(0, 10).map((vehicle) => (
                    <tr key={vehicle._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-blue-600">{vehicle.PlateNo}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{vehicle.vehicleBrand}</p>
                          <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{vehicle.customer?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{vehicle.customer?.email || ''}</p>
                          <p className="text-sm text-gray-600">{vehicle.customer?.phone || ''}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(vehicle.status)}>
                          {getStatusLabel(vehicle.status)}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">
                        {vehicle.totalAmount ? `${vehicle.totalAmount.toLocaleString()} RWF` : 'Pending'}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(vehicle.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredVehicles.length === 0 && (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No vehicles found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
              
              {filteredVehicles.length > 10 && (
                <div className="text-center py-4 text-sm text-gray-600">
                  Showing 10 of {filteredVehicles.length} vehicles
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mechanic Workload */}
        {mechanics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mechanic Workload</CardTitle>
              <CardDescription>Current workload distribution among mechanics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mechanics.map((mechanic) => {
                  // Find workload data for this mechanic
                  const workload = mechanicWorkload.find(w => w.mechanic._id === mechanic._id)
                  const assignedVehicles = workload?.assignedVehicles || 0
                  
                  return (
                    <div key={mechanic._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{mechanic.firstName} {mechanic.lastName}</h4>
                        <Badge className={
                          assignedVehicles > 5 ? 'bg-red-100 text-red-800' :
                          assignedVehicles > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {assignedVehicles > 5 ? 'Overloaded' :
                           assignedVehicles > 2 ? 'Busy' : 'Available'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Assigned vehicles: <span className="font-medium">{assignedVehicles}</span>
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              assignedVehicles > 5 ? 'bg-red-500' :
                              assignedVehicles > 2 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((assignedVehicles / 6) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ManagerOperations
