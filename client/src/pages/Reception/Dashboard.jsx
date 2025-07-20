import React, { useContext, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReceptionContext } from '@/context/ReceptionContext'
import { AuthContext } from '@/context/AuthContext'
import { 
  Car, 
  Wrench, 
  CheckCircle, 
  Plus, 
  Calendar,
  Clock,
  User,
  Phone
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { dashData, getDashData } = useContext(ReceptionContext)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    getDashData()
  }, [])

  const stats = [
    {
      title: 'Total Vehicles',
      value: dashData?.totalVehicles || 0,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'All vehicles registered'
    },
    {
      title: 'In Service',
      value: dashData?.inServiceVehicles || 0,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Currently being serviced'
    },
    {
      title: 'Completed',
      value: dashData?.completedVehicles || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Services completed'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'awaiting-diagnosis':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'waiting-parts':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reception Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName || 'Receptionist'}! Here's what's happening today.
          </p>
        </div>
        <Link to="/reception/add-vehicle">
          <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashData?.latestVehicles && dashData.latestVehicles.length > 0 ? (
                dashData.latestVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Car className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {vehicle.vehicleBrand} {vehicle.vehicleType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.PlateNo} • {vehicle.customer.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                        {formatStatus(vehicle.status)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(vehicle.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No vehicles added yet</p>
                  <Link to="/reception/add-vehicle">
                    <Button variant="outline" className="mt-3" size="sm">
                      Add First Vehicle
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/reception/add-vehicle" className="block">
                <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-green-50 hover:border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Add New Vehicle</p>
                      <p className="text-sm text-muted-foreground">Register a new vehicle for service</p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/reception/in-service" className="block">
                <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-orange-50 hover:border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">View In Service</p>
                      <p className="text-sm text-muted-foreground">Check vehicles currently being serviced</p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/reception/cleared" className="block">
                <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-purple-50 hover:border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Cleared Vehicles</p>
                      <p className="text-sm text-muted-foreground">View completed services</p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dashData?.totalVehicles || 0}
              </div>
              <div className="text-sm text-blue-600 font-medium">Total Vehicles</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {dashData?.latestVehicles?.filter(v => v.status === 'awaiting-diagnosis').length || 0}
              </div>
              <div className="text-sm text-yellow-600 font-medium">Awaiting Diagnosis</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {dashData?.latestVehicles?.filter(v => v.status === 'in-progress').length || 0}
              </div>
              <div className="text-sm text-orange-600 font-medium">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dashData?.completedVehicles || 0}
              </div>
              <div className="text-sm text-green-600 font-medium">Completed Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
