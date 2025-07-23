import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Settings, 
  FileText,
  Hash,
  Shield,
  Eye,
  X
} from 'lucide-react'

const ViewVehicleModal = ({ vehicle, trigger }) => {
  if (!vehicle) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'awaiting-diagnosis':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'waiting-parts':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            Vehicle Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Image and Basic Info */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                {vehicle.image ? (
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.vehicleBrand} ${vehicle.vehicleType}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                    <Car className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {vehicle.vehicleBrand} {vehicle.vehicleType}
                </h2>
                <p className="text-xl text-muted-foreground">{vehicle.ModelYear}</p>
                <div className="mt-2">
                  <Badge className={`${getStatusColor(vehicle.status)} text-sm`}>
                    {formatStatus(vehicle.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Hash className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plate Number</p>
                    <p className="font-semibold">{vehicle.PlateNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Settings className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engine</p>
                    <p className="font-semibold">{vehicle.engine}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Hash className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                    <p className="font-semibold">{vehicle.ChassisNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                    <p className="font-semibold">{vehicle.insurance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-semibold">{vehicle.customer.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-semibold">{vehicle.customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-semibold">{vehicle.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              Service Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Hash className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">TIN Number</p>
                  <p className="font-semibold">{vehicle.TinNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Added</p>
                  <p className="font-semibold">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-foreground">Service Concerns</h4>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">{vehicle.concerns}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="font-semibold">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{formatDate(vehicle.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewVehicleModal
