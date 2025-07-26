import React, { useEffect, useState } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Car, 
  Search, 
  Eye, 
  FileText,
  Download,
  Printer,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  X,
  Receipt,
  CreditCard
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Invoice Creation Modal - moved outside component
const InvoiceModal = ({ show, selectedVehicle, invoiceData, setInvoiceData, onClose, onSubmit }) => {
  if (!show || !selectedVehicle) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Create Invoice</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Invoice Number</label>
            <Input
              value={invoiceData.invoiceNumber}
              onChange={(e) => setInvoiceData(prev => ({...prev, invoiceNumber: e.target.value}))}
              placeholder="INV-20250124-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <Input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData(prev => ({...prev, dueDate: e.target.value}))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
            <Input
              type="number"
              value={invoiceData.taxRate || ''}
              onChange={(e) => setInvoiceData(prev => ({...prev, taxRate: Number(e.target.value)}))}
              placeholder="18"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}

// Payment Recording Modal - moved outside component
const PaymentModal = ({ show, selectedVehicle, paymentData, setPaymentData, onClose, onSubmit }) => {
  if (!show || !selectedVehicle) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full" key={selectedVehicle._id}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Record Payment</h3>
          <p className="text-sm text-gray-600">
            Outstanding: RWF {((selectedVehicle.totalAmount || 0) - (selectedVehicle.paidAmount || 0)).toLocaleString()}
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Amount</label>
            <Input
              type="number"
              value={paymentData.amount || ''}
              onChange={(e) => setPaymentData(prev => ({...prev, amount: Number(e.target.value)}))}
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData(prev => ({...prev, paymentMethod: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="credit_card">Credit Card</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          {/* Conditional fields based on payment method */}
          {paymentData.paymentMethod === 'mobile_money' && (
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={paymentData.phoneNumber}
                onChange={(e) => setPaymentData(prev => ({...prev, phoneNumber: e.target.value}))}
                placeholder="Enter phone number"
              />
            </div>
          )}

          {(['bank_transfer', 'credit_card'].includes(paymentData.paymentMethod)) && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {paymentData.paymentMethod === 'bank_transfer' ? 'Account Number' : 'Card Number'}
              </label>
              <Input
                type="text"
                value={paymentData.accountNumber}
                onChange={(e) => setPaymentData(prev => ({...prev, accountNumber: e.target.value}))}
                placeholder={paymentData.paymentMethod === 'bank_transfer' ? 'Enter account number' : 'Enter card number'}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Payment notes..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Record Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

const ClearedVehicles = () => {
  const { 
    clearedVehicles, 
    loading, 
    fetchClearedVehicles,
    createInvoice,
    recordPayment
  } = useAccountant()

  const [searchTerm, setSearchTerm] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    dueDate: '',
    notes: '',
    taxRate: 18
  })
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    notes: '',
    phoneNumber: '',
    accountNumber: ''
  })

  useEffect(() => {
    fetchClearedVehicles()
  }, [])

  useEffect(() => {
    let filtered = clearedVehicles || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.PlateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Payment status filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.paymentStatus === paymentFilter)
    }

    setFilteredVehicles(filtered)
  }, [clearedVehicles, searchTerm, paymentFilter])

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500'
      case 'partially-paid': return 'bg-yellow-500'
      case 'unpaid': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  const handleCreateInvoice = (vehicle) => {
    setSelectedVehicle(vehicle)
    setInvoiceData({
      invoiceNumber: generateInvoiceNumber(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
      taxRate: 18
    })
    setShowInvoiceModal(true)
  }

  const handleRecordPayment = (vehicle) => {
    setSelectedVehicle(vehicle)
    setPaymentData({
      amount: vehicle.totalAmount - (vehicle.paidAmount || 0),
      paymentMethod: 'cash',
      notes: '',
      phoneNumber: '',
      accountNumber: ''
    })
    setShowPaymentModal(true)
  }

  const submitInvoice = async () => {
    try {
      await createInvoice(selectedVehicle._id, invoiceData)
      setShowInvoiceModal(false)
      setSelectedVehicle(null)
      fetchClearedVehicles()
    } catch (error) {
      console.error('Failed to create invoice:', error)
    }
  }

  const submitPayment = async () => {
    try {
      await recordPayment(selectedVehicle._id, paymentData)
      setShowPaymentModal(false)
      setSelectedVehicle(null)
      fetchClearedVehicles()
    } catch (error) {
      console.error('Failed to record payment:', error)
    }
  }

  const generateInvoicePDF = (vehicle) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, 210, 35, 'F')
    
    // Logo and Company Info
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('AUTOHUB GARAGE', 20, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Professional Vehicle Repair & Maintenance Services', 20, 28)
    
    // Invoice Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 20, 55)
    
    // Invoice Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice #: ${vehicle.invoiceNumber || invoiceData.invoiceNumber}`, 20, 70)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 78)
    doc.text(`Due Date: ${invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 86)
    
    // Customer Information
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, 105)
    doc.setFont('helvetica', 'normal')
    doc.text(`${vehicle.customer?.name}`, 20, 115)
    doc.text(`Phone: ${vehicle.customer?.phone}`, 20, 123)
    doc.text(`Email: ${vehicle.customer?.email}`, 20, 131)
    
    // Vehicle Information
    doc.setFont('helvetica', 'bold')
    doc.text('VEHICLE DETAILS:', 110, 105)
    doc.setFont('helvetica', 'normal')
    doc.text(`${vehicle.vehicleBrand} ${vehicle.vehicleType}`, 110, 115)
    doc.text(`Plate: ${vehicle.PlateNo}`, 110, 123)
    doc.text(`Year: ${vehicle.ModelYear}`, 110, 131)
    
    // Service Details Table
    const tableData = [
      ['Service Description', 'Amount'],
      ['Vehicle Repair & Maintenance', `RWF ${vehicle.totalAmount?.toLocaleString() || '0'}`],
      ['Parts & Labor', `RWF ${(vehicle.totalAmount * 0.8)?.toLocaleString() || '0'}`],
      ['Service Charge', `RWF ${(vehicle.totalAmount * 0.2)?.toLocaleString() || '0'}`]
    ]
    
    autoTable(doc, {
      body: tableData,
      startY: 150,
      theme: 'grid',
      headStyles: { 
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255]
      }
    })
    
    // Totals
    const finalY = doc.lastAutoTable.finalY + 20
    doc.setFont('helvetica', 'bold')
    doc.text(`Subtotal: RWF ${vehicle.totalAmount?.toLocaleString() || '0'}`, 140, finalY)
    doc.text(`Tax (${invoiceData.taxRate}%): RWF ${((vehicle.totalAmount * invoiceData.taxRate) / 100)?.toLocaleString() || '0'}`, 140, finalY + 8)
    doc.text(`TOTAL: RWF ${(vehicle.totalAmount * (1 + invoiceData.taxRate / 100))?.toLocaleString() || '0'}`, 140, finalY + 16)
    
    // Payment Status
    if (vehicle.paymentStatus === 'paid') {
      doc.setTextColor(0, 128, 0)
      doc.text('PAID', 20, finalY + 16)
    } else {
      doc.setTextColor(255, 0, 0)
      doc.text('UNPAID', 20, finalY + 16)
    }
    
    // Footer
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.text('Thank you for your business!', 20, finalY + 35)
    doc.text('Payment due within 30 days of invoice date.', 20, finalY + 42)
    
    doc.save(`Invoice-${vehicle.PlateNo}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Vehicle Details Modal
  const VehicleModal = () => {
    if (!showVehicleModal || !selectedVehicle) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vehicle Service Details</h2>
            <Button variant="ghost" onClick={() => setShowVehicleModal(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Vehicle & Customer Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Vehicle Information</h3>
                <div className="space-y-2">
                  <p><strong>Vehicle:</strong> {selectedVehicle.vehicleBrand} {selectedVehicle.vehicleType}</p>
                  <p><strong>Plate:</strong> {selectedVehicle.PlateNo}</p>
                  <p><strong>Year:</strong> {selectedVehicle.ModelYear}</p>
                  <p><strong>Chassis:</strong> {selectedVehicle.ChassisNo}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedVehicle.customer?.name}</p>
                  <p><strong>Phone:</strong> {selectedVehicle.customer?.phone}</p>
                  <p><strong>Email:</strong> {selectedVehicle.customer?.email}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold">RWF {selectedVehicle.totalAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid Amount</p>
                  <p className="text-lg font-semibold text-green-600">RWF {selectedVehicle.paidAmount?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-lg font-semibold text-red-600">
                    RWF {((selectedVehicle.totalAmount || 0) - (selectedVehicle.paidAmount || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Service History */}
            <div>
              <h3 className="font-semibold mb-3">Service History</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Completed:</strong> {new Date(selectedVehicle.completedAt).toLocaleDateString()}</p>
                <p><strong>Service Notes:</strong> {selectedVehicle.serviceNotes || 'No notes available'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVehicleModal(false)}>
              Close
            </Button>
            <Button onClick={() => generateInvoicePDF(selectedVehicle)} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            {selectedVehicle.paymentStatus !== 'paid' && (
              <Button onClick={() => handleRecordPayment(selectedVehicle)}>
                <CreditCard className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            )}
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
          <h1 className="text-3xl font-bold text-gray-900">Completed Vehicles</h1>
          <p className="text-gray-600">Manage invoicing and payments for completed services</p>
        </div>
        <Button onClick={fetchClearedVehicles} variant="outline">
          <Car className="w-4 h-4 mr-2" />
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
                  placeholder="Search by vehicle, plate number, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="partially-paid">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vehicle.vehicleBrand} {vehicle.vehicleType}</CardTitle>
                <Badge className={`${getPaymentStatusColor(vehicle.paymentStatus)} text-white`}>
                  {vehicle.paymentStatus}
                </Badge>
              </div>
              <CardDescription>
                Plate: {vehicle.PlateNo}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{vehicle.customer?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Completed: {new Date(vehicle.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Total: RWF {vehicle.totalAmount?.toLocaleString()}</span>
                </div>
                {vehicle.paidAmount > 0 && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Paid: RWF {vehicle.paidAmount?.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-3 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedVehicle(vehicle)
                    setShowVehicleModal(true)
                  }}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleCreateInvoice(vehicle)}
                    className="flex-1"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                  <Button 
                    onClick={() => generateInvoicePDF(vehicle)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>

                {vehicle.paymentStatus !== 'paid' && (
                  <Button 
                    onClick={() => handleRecordPayment(vehicle)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                )}
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
              {searchTerm || paymentFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No completed vehicles available yet'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <VehicleModal />
      <InvoiceModal 
        show={showInvoiceModal}
        selectedVehicle={selectedVehicle}
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={submitInvoice}
      />
      <PaymentModal 
        show={showPaymentModal}
        selectedVehicle={selectedVehicle}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={submitPayment}
      />
    </div>
  )
}

export default ClearedVehicles
