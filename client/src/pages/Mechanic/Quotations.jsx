import React, { useEffect, useState, useCallback } from 'react'
import { useMechanic } from '../../context/MechanicContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  FileText, 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  Download,
  User,
  Calendar,
  Car,
  X,
  DollarSign
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Status Update Modal as a separate component to prevent re-renders
const StatusUpdateModal = React.memo(({ 
  isOpen, 
  onClose, 
  statusData, 
  onStatusDataChange, 
  onSubmit 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {statusData.status === 'approved' ? 'Approve Quotation' : 'Reject Quotation'}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {statusData.status === 'approved' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              value={statusData.notes}
              onChange={(e) => onStatusDataChange(e.target.value)}
              placeholder={statusData.status === 'approved' 
                ? 'Add any notes about the approval...' 
                : 'Please provide reason for rejection...'
              }
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className={statusData.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {statusData.status === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </div>
    </div>
  )
})

const Quotations = () => {
  const { quotations, loading, fetchQuotations, updateQuotationStatus } = useMechanic()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredQuotations, setFilteredQuotations] = useState([])
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [statusUpdateModal, setStatusUpdateModal] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState({ status: '', notes: '' })

  useEffect(() => {
    fetchQuotations()
  }, [])

  useEffect(() => {
    let filtered = quotations || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quotation => 
        quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.vehicleId?.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.vehicleId?.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.vehicleId?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quotation => quotation.status === statusFilter)
    }

    setFilteredQuotations(filtered)
  }, [quotations, searchTerm, statusFilter])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation)
    setShowQuotationModal(true)
  }

  const handleStatusUpdate = useCallback((quotation, status) => {
    setSelectedQuotation(quotation)
    setStatusUpdateData({ status, notes: '' })
    setStatusUpdateModal(true)
  }, [])

  const handleNotesChange = useCallback((value) => {
    setStatusUpdateData(prev => ({...prev, notes: value}))
  }, [])

  const closeStatusModal = useCallback(() => {
    setStatusUpdateModal(false)
    setSelectedQuotation(null)
    setStatusUpdateData({ status: '', notes: '' })
  }, [])

  const submitStatusUpdate = useCallback(async () => {
    try {
      await updateQuotationStatus(selectedQuotation._id, statusUpdateData.status, statusUpdateData.notes)
      closeStatusModal()
      fetchQuotations() // Refresh the list
    } catch (error) {
      console.error('Failed to update quotation status:', error)
    }
  }, [selectedQuotation, statusUpdateData, updateQuotationStatus, fetchQuotations, closeStatusModal])

  const generatePDF = (quotation) => {
    const doc = new jsPDF()
    
    // Header with Logo and Garage Details (using project theme color - blue-600)
    doc.setFillColor(37, 99, 235) // Blue-600 theme color
    doc.rect(0, 0, 210, 40, 'F')
    
    // Logo placeholder (you can replace this with actual logo)
    doc.setFillColor(255, 255, 255)
    doc.circle(25, 20, 12, 'F')
    doc.setTextColor(37, 99, 235) // Blue-600 for logo text
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('AutoHub', 21, 24)
    
    // Garage Name and Details
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('AUTOHUB', 45, 18)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Professional Vehicle Repair & Maintenance Services', 45, 26)
    doc.text('Kigali, Rwanda  |  +250 788 123 456  |  info@autohub.rw', 45, 32)
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Quotation Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('VEHICLE REPAIR QUOTATION', 20, 60)
    
    // Quotation Info Box
    doc.setFillColor(248, 249, 250)
    doc.rect(20, 70, 170, 25, 'F')
    doc.setDrawColor(200, 200, 200)
    doc.rect(20, 70, 170, 25, 'S')
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Quotation #: ${quotation.quotationNumber}`, 25, 80)
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 25, 87)
    doc.text(`Status: ${quotation.status.toUpperCase()}`, 120, 80)
    doc.text(`Valid Until: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 120, 87)
    
    // Customer and Vehicle Information Side by Side
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('CUSTOMER INFORMATION', 20, 110)
    doc.text('VEHICLE INFORMATION', 110, 110)
    
    // Customer Info
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Name: ${quotation.vehicleId?.customer?.name || 'N/A'}`, 20, 120)
    doc.text(`Phone: ${quotation.vehicleId?.customer?.phone || 'N/A'}`, 20, 127)
    doc.text(`Email: ${quotation.vehicleId?.customer?.email || 'N/A'}`, 20, 134)
    
    // Vehicle Info
    doc.text(`Vehicle: ${quotation.vehicleId?.vehicleBrand} ${quotation.vehicleId?.vehicleType}`, 110, 120)
    doc.text(`Plate Number: ${quotation.vehicleId?.PlateNo}`, 110, 127)
    doc.text(`Year: ${quotation.vehicleId?.ModelYear}`, 110, 134)
    doc.text(`Chassis: ${quotation.vehicleId?.ChassisNo}`, 110, 141)
    
    // Diagnosis Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('DIAGNOSIS & RECOMMENDATIONS', 20, 160)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const diagnosisLines = doc.splitTextToSize(quotation.diagnosis, 170)
    doc.text(diagnosisLines, 20, 170)
    
    // Parts Table
    const tableStartY = 170 + (diagnosisLines.length * 5) + 20
    
    const tableData = quotation.parts.map(part => [
      part.description,
      part.quantity.toString(),
      new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(part.unitPrice),
      new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(part.totalPrice)
    ])
    
    autoTable(doc, {
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      startY: tableStartY,
      theme: 'striped',
      headStyles: { 
        fillColor: [37, 99, 235], // Blue-600 theme color
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 20, right: 20 }
    })
    
    // Summary Section
    const finalY = doc.lastAutoTable.finalY + 20
    
    // Summary Box
    doc.setFillColor(248, 249, 250)
    doc.rect(120, finalY, 70, 60, 'F')
    doc.setDrawColor(200, 200, 200)
    doc.rect(120, finalY, 70, 60, 'S')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('QUOTATION SUMMARY', 125, finalY + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Parts Total:`, 125, finalY + 20)
    doc.text(`${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(quotation.summary.partsTotal)}`, 160, finalY + 20)
    
    doc.text(`Service Charge:`, 125, finalY + 27)
    doc.text(`${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(quotation.serviceCharge)}`, 160, finalY + 27)
    
    doc.text(`Subtotal:`, 125, finalY + 34)
    doc.text(`${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(quotation.summary.subtotal)}`, 160, finalY + 34)
    
    if (quotation.summary.includeVAT) {
      doc.text(`VAT (${quotation.summary.taxRate}%):`, 125, finalY + 41)
      doc.text(`${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(quotation.summary.taxAmount)}`, 160, finalY + 41)
    }
    
    // Grand Total
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setDrawColor(37, 99, 235) // Blue-600 theme color for line
    doc.line(125, finalY + 48, 185, finalY + 48)
    doc.text(`GRAND TOTAL:`, 125, finalY + 55)
    doc.text(`${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(quotation.summary.grandTotal)}`, 160, finalY + 55)
    
    // Footer
    const footerY = finalY + 80
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Terms & Conditions:', 20, footerY)
    doc.text('• This quotation is valid for 30 days from the date of issue', 20, footerY + 7)
    doc.text('• Prices may vary if additional issues are discovered during service', 20, footerY + 14)
    doc.text('• Payment is due upon completion of service', 20, footerY + 21)
    doc.text('• Warranty applies as per our standard terms', 20, footerY + 28)
    
    doc.text('Thank you for choosing AutoHub Garage!', 20, footerY + 40)
    
    // Save PDF
    doc.save(`Quotation-${quotation.quotationNumber}.pdf`)
  }

  // Quotation Details Modal
  const QuotationModal = () => {
    if (!showQuotationModal || !selectedQuotation) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Quotation Details</h2>
              <p className="text-gray-600">{selectedQuotation.quotationNumber}</p>
            </div>
            <Button variant="ghost" onClick={() => setShowQuotationModal(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Status and Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(selectedQuotation.status)} text-white`}>
                  {selectedQuotation.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Created: {new Date(selectedQuotation.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Button onClick={() => generatePDF(selectedQuotation)} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Vehicle & Customer Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Vehicle Information</h3>
                <div className="space-y-2">
                  <p><strong>Vehicle:</strong> {selectedQuotation.vehicleId?.vehicleBrand} {selectedQuotation.vehicleId?.vehicleType}</p>
                  <p><strong>Plate:</strong> {selectedQuotation.vehicleId?.PlateNo}</p>
                  <p><strong>Year:</strong> {selectedQuotation.vehicleId?.ModelYear}</p>
                  <p><strong>Chassis:</strong> {selectedQuotation.vehicleId?.ChassisNo}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedQuotation.vehicleId?.customer?.name}</p>
                  <p><strong>Phone:</strong> {selectedQuotation.vehicleId?.customer?.phone}</p>
                  <p><strong>Email:</strong> {selectedQuotation.vehicleId?.customer?.email}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <h3 className="font-semibold mb-3">Diagnosis</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>{selectedQuotation.diagnosis}</p>
              </div>
            </div>

            {/* Parts */}
            <div>
              <h3 className="font-semibold mb-3">Parts Required</h3>
              <div className="space-y-3">
                {selectedQuotation.parts.map((part, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <div className="font-medium">{part.description}</div>
                      <Badge variant={part.availability === 'in-stock' ? 'default' : 'destructive'}>
                        {part.availability}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {part.quantity} × {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF'
                        }).format(part.unitPrice)}
                      </div>
                      <div className="text-lg font-semibold">
                        {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF'
                        }).format(part.totalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Parts Total:</span>
                      <span>{new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF'
                      }).format(selectedQuotation.summary.partsTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge:</span>
                      <span>{new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF'
                      }).format(selectedQuotation.serviceCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF'
                      }).format(selectedQuotation.summary.subtotal)}</span>
                    </div>
                    {selectedQuotation.summary.includeVAT && (
                      <div className="flex justify-between">
                        <span>VAT ({selectedQuotation.summary.taxRate}%):</span>
                        <span>{new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF'
                        }).format(selectedQuotation.summary.taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>GRAND TOTAL:</span>
                      <span>{new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF'
                      }).format(selectedQuotation.summary.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedQuotation.notes && (
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>{selectedQuotation.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowQuotationModal(false)}>
              Close
            </Button>
            {selectedQuotation.status === 'pending' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedQuotation, 'rejected')}
                  className="text-red-600 border-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Rejected
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedQuotation, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Approved
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading quotations...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations Management</h1>
          <p className="text-gray-600">Manage and track quotation statuses</p>
        </div>
        <Button onClick={fetchQuotations} variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by quotation number, vehicle, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{quotation.quotationNumber}</CardTitle>
                <Badge className={`${getStatusColor(quotation.status)} text-white`}>
                  {quotation.status}
                </Badge>
              </div>
              <CardDescription>
                {quotation.vehicleId?.vehicleBrand} {quotation.vehicleId?.vehicleType} - {quotation.vehicleId?.PlateNo}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quotation Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{quotation.vehicleId?.customer?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created: {new Date(quotation.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Total: {new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(quotation.summary.grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-3 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewQuotation(quotation)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                
                {quotation.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate(quotation, 'rejected')}
                      className="flex-1 text-red-600 border-red-600"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate(quotation, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}

                {quotation.status !== 'pending' && (
                  <Button 
                    variant="outline"
                    onClick={() => generatePDF(quotation)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No quotations message */}
      {filteredQuotations.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotations found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No quotations have been created yet'
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <QuotationModal />
      <StatusUpdateModal 
        isOpen={statusUpdateModal}
        onClose={closeStatusModal}
        statusData={statusUpdateData}
        onStatusDataChange={handleNotesChange}
        onSubmit={submitStatusUpdate}
      />
    </div>
  )
}

export default Quotations
