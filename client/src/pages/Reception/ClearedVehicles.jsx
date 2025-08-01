import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ViewVehicleModal from '@/components/ViewVehicleModal'
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
  FileText,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const ClearedVehicles = () => {
  const { vehicles, getAllVehicles } = useContext(ReceptionContext)
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Filters
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Function to download individual vehicle report as PDF
  const downloadVehicleReport = (vehicle) => {
    try {
      const doc = new jsPDF()
      const serviceDuration = calculateServiceDuration(vehicle.createdAt, vehicle.updatedAt)
      
      // Header with gradient background - using garage-blue to garage-green gradient
      // garage-blue: hsl(210, 100%, 12%) = rgb(0, 61, 122)
      // garage-green: hsl(142, 76%, 36%) = rgb(22, 163, 74)
      const startColor = [0, 61, 122]
      const endColor = [22, 163, 74]
      
      // Create gradient effect by drawing multiple rectangles
      for (let i = 0; i <= 210; i += 2) {
        const ratio = i / 210
        const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio)
        const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio)
        const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio)
        
        doc.setFillColor(r, g, b)
        doc.rect(i, 0, 2, 45, 'F')
      }
      
      // Add simple text logo
      doc.setFillColor(255, 255, 255)
      doc.circle(25, 22, 12, 'F')
      doc.setTextColor(22, 163, 74)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AH', 21, 26)
      
      // Company Info
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('AUTOHUB GARAGE', 45, 18)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Professional Vehicle Repair & Maintenance Services', 45, 26)
      
      // Contact details
      doc.setFontSize(8)
      doc.text('Location: Kigali, Rwanda', 45, 33)
      doc.text('Tel: +250 788 349 679 | Email: autohubgaragerw@gmail.com', 45, 39)
      
      // Report Title
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('VEHICLE SERVICE REPORT', 20, 60)
      
      // Report Details
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, 72)
      doc.text(`Report ID: ASR-${vehicle.PlateNo}-${new Date().getTime()}`, 20, 80)
      
      // Vehicle Information
      doc.setFont('helvetica', 'bold')
      doc.text('VEHICLE INFORMATION', 20, 95)
      doc.setFont('helvetica', 'normal')
      doc.text(`Vehicle: ${vehicle.vehicleBrand} ${vehicle.vehicleType}`, 20, 105)
      doc.text(`Model Year: ${vehicle.ModelYear}`, 20, 113)
      doc.text(`Plate Number: ${vehicle.PlateNo}`, 20, 121)
      doc.text(`Chassis Number: ${vehicle.ChassisNo}`, 20, 129)
      doc.text(`Engine: ${vehicle.engine}`, 20, 137)
      doc.text(`Insurance: ${vehicle.insurance}`, 20, 145)
      doc.text(`TIN Number: ${vehicle.TinNo}`, 20, 153)
      
      // Customer Information
      doc.text(`Customer: ${vehicle.customer.name}`, 110, 105)
      doc.text(`Phone: ${vehicle.customer.phone}`, 110, 113)
      doc.text(`Email: ${vehicle.customer.email}`, 110, 121)
      
      // Service Details
      doc.setFont('helvetica', 'bold')
      doc.text('SERVICE DETAILS', 20, 170)
      doc.setFont('helvetica', 'normal')
      doc.text(`Service Status: COMPLETED`, 20, 180)
      doc.text(`Service Started: ${formatDate(vehicle.createdAt)}`, 20, 188)
      doc.text(`Service Completed: ${formatDate(vehicle.updatedAt)}`, 20, 196)
      doc.text(`Total Service Duration: ${serviceDuration} ${serviceDuration === 1 ? 'day' : 'days'}`, 20, 204)
      
      // Payment Information
      if (vehicle.totalAmount) {
        doc.text(`Total Amount: RWF ${vehicle.totalAmount.toLocaleString()}`, 110, 180)
        doc.text(`Payment Status: ${vehicle.paymentStatus?.toUpperCase() || 'UNKNOWN'}`, 110, 188)
        if (vehicle.paidAmount) {
          doc.text(`Amount Paid: RWF ${vehicle.paidAmount.toLocaleString()}`, 110, 196)
        }
      }
      
      // Service Items Table (if quotation exists)
      if (vehicle.quotation && vehicle.quotation.parts && vehicle.quotation.parts.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.text('SERVICE ITEMS & PARTS', 20, 220)
        
        const tableData = vehicle.quotation.parts.map(part => [
          part.description || 'Service Item',
          part.quantity.toString(),
          `RWF ${part.unitPrice.toLocaleString()}`,
          `RWF ${part.totalPrice.toLocaleString()}`
        ])
        
        autoTable(doc, {
          head: [['Description', 'Quantity', 'Unit Price', 'Total']],
          body: tableData,
          startY: 230,
          theme: 'grid',
          headStyles: { fillColor: [22, 163, 74] } // Using garage-green color
        })
      }
      
      // Original Concerns
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 230
      doc.setFont('helvetica', 'bold')
      doc.text('ORIGINAL CONCERNS', 20, finalY)
      doc.setFont('helvetica', 'normal')
      const concernsText = doc.splitTextToSize(vehicle.concerns, 170)
      doc.text(concernsText, 20, finalY + 10)
      
      // Footer
      const footerY = finalY + 40
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('Thank you for choosing AutoHub for your vehicle service needs!', 20, footerY)
      doc.text('Location: Kigali, Rwanda | Tel: +250 788 349 679 | Email: autohubgaragerw@gmail.com', 20, footerY + 8)
      
      doc.save(`AutoHub-Service-Report-${vehicle.PlateNo}-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('Service report downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download report')
    }
  }

  // Function to download invoice for completed vehicle
  const downloadVehicleInvoice = (vehicle) => {
    if (!vehicle.totalAmount) {
      toast.error('Invoice cannot be generated - no payment information available')
      return
    }

    try {
      const doc = new jsPDF()
      
      // Create gradient background for header
      const pageWidth = doc.internal.pageSize.getWidth()
      const headerHeight = 60
      
      // Create gradient using small rectangles (garage-blue to garage-green)
      for (let i = 0; i < headerHeight; i++) {
        const ratio = i / headerHeight
        const r = Math.round(0 + (22 - 0) * ratio)
        const g = Math.round(61 + (163 - 61) * ratio)
        const b = Math.round(122 + (74 - 122) * ratio)
        
        doc.setFillColor(r, g, b)
        doc.rect(0, i, pageWidth, 1, 'F')
      }
      
      // Add simple text logo
      doc.setFillColor(255, 255, 255)
      doc.circle(25, 35, 12, 'F')
      doc.setTextColor(22, 163, 74)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AH', 21, 39)
      
      // Company title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('AUTOHUB GARAGE', 50, 20)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Professional Vehicle Service & Repair', 50, 28)
      
      // Contact information on the right
      doc.setFontSize(9)
      doc.text('Location: Kigali, Rwanda', 120, 18)
      doc.text('Tel: +250 788 349 679', 120, 26)
      doc.text('Email: autohubgaragerw@gmail.com', 120, 34)
      
      // Reset text color to black
      doc.setTextColor(0, 0, 0)
      
      // Invoice Title
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('INVOICE', 20, 80)
      
      // Invoice Details
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const invoiceNumber = vehicle.invoiceNumber || `INV-${vehicle.PlateNo}-${new Date().getTime()}`
      doc.text(`Invoice #: ${invoiceNumber}`, 20, 95)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 103)
      doc.text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 111)
      
      // Customer Information
      doc.setFont('helvetica', 'bold')
      doc.text('BILL TO:', 20, 130)
      doc.setFont('helvetica', 'normal')
      doc.text(`${vehicle.customer.name}`, 20, 140)
      doc.text(`Phone: ${vehicle.customer.phone}`, 20, 148)
      doc.text(`Email: ${vehicle.customer.email}`, 20, 156)
      
      // Vehicle Information
      doc.setFont('helvetica', 'bold')
      doc.text('VEHICLE DETAILS:', 110, 130)
      doc.setFont('helvetica', 'normal')
      doc.text(`${vehicle.vehicleBrand} ${vehicle.vehicleType}`, 110, 140)
      doc.text(`Plate: ${vehicle.PlateNo}`, 110, 148)
      doc.text(`Year: ${vehicle.ModelYear}`, 110, 156)
      
      // Service Items Table
      const tableData = []
      
      if (vehicle.quotation && vehicle.quotation.parts) {
        vehicle.quotation.parts.forEach(part => {
          tableData.push([
            part.description || 'Service Item',
            part.quantity.toString(),
            `RWF ${part.unitPrice.toLocaleString()}`,
            `RWF ${part.totalPrice.toLocaleString()}`
          ])
        })
      } else {
        tableData.push([
          'Vehicle Repair & Maintenance Service',
          '1',
          `RWF ${vehicle.totalAmount.toLocaleString()}`,
          `RWF ${vehicle.totalAmount.toLocaleString()}`
        ])
      }
      
      autoTable(doc, {
        head: [['Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        startY: 170,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] } // Using garage-green color
      })
      
      // Totals
      const finalY = doc.lastAutoTable.finalY + 20
      const subtotal = vehicle.totalAmount
      const taxRate = 18 // Default 18% VAT
      const taxAmount = (subtotal * taxRate) / 100
      const total = subtotal + taxAmount
      
      doc.setFont('helvetica', 'bold')
      doc.text(`Subtotal: RWF ${subtotal.toLocaleString()}`, 140, finalY)
      doc.text(`VAT (${taxRate}%): RWF ${taxAmount.toLocaleString()}`, 140, finalY + 8)
      doc.text(`TOTAL: RWF ${total.toLocaleString()}`, 140, finalY + 16)
      
      // Payment Status
      if (vehicle.paymentStatus === 'paid') {
        doc.setTextColor(0, 128, 0)
        doc.text('PAID', 20, finalY + 16)
      } else {
        doc.setTextColor(255, 0, 0)
        doc.text(`OUTSTANDING: RWF ${(total - (vehicle.paidAmount || 0)).toLocaleString()}`, 20, finalY + 16)
      }
      
      // Footer
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      doc.text('Thank you for your business!', 20, finalY + 35)
      doc.text('Payment due within 30 days of invoice date.', 20, finalY + 42)
      doc.text('Location: Kigali, Rwanda | Tel: +250 788 349 679 | Email: autohubgaragerw@gmail.com', 20, finalY + 49)
      
      doc.save(`AutoHub-Invoice-${vehicle.PlateNo}-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      console.error('Invoice download error:', error)
      toast.error('Failed to download invoice')
    }
  }

  // Function to export all cleared vehicles report as Excel
  const exportAllReport = () => {
    if (filteredVehicles.length === 0) {
      toast.error('No cleared vehicles to export')
      return
    }

    try {
      const totalVehicles = filteredVehicles.length
      const thisWeekCount = filteredVehicles.filter(v => 
        new Date(v.updatedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
      const avgDuration = totalVehicles > 0 
        ? Math.round(filteredVehicles.reduce((acc, v) => 
            acc + calculateServiceDuration(v.createdAt, v.updatedAt), 0
          ) / totalVehicles)
        : 0

      // Create summary data
      const summaryData = [
        ['AUTOHUB GARAGE - CLEARED VEHICLES REPORT'],
        [`Generated: ${new Date().toLocaleString()}`],
        [`Total Completed Vehicles: ${totalVehicles}`],
        [`Completed This Week: ${thisWeekCount}`],
        [`Average Service Duration: ${avgDuration} days`],
        [''],
        ['DETAILED VEHICLE LIST'],
        ['']
      ]

      // Create headers for detailed data
      const headers = [
        'S/N',
        'Vehicle Brand',
        'Vehicle Type',
        'Model Year',
        'Plate Number',
        'Customer Name',
        'Customer Phone',
        'Customer Email',
        'Service Started',
        'Service Completed',
        'Duration (Days)',
        'Total Amount (RWF)',
        'Paid Amount (RWF)',
        'Payment Status',
        'Original Concerns',
        'Insurance',
        'TIN Number',
        'Chassis Number'
      ]

      // Create detailed vehicle data
      const vehicleData = filteredVehicles.map((vehicle, index) => {
        const serviceDuration = calculateServiceDuration(vehicle.createdAt, vehicle.updatedAt)
        return [
          index + 1,
          vehicle.vehicleBrand,
          vehicle.vehicleType,
          vehicle.ModelYear,
          vehicle.PlateNo,
          vehicle.customer.name,
          vehicle.customer.phone,
          vehicle.customer.email,
          formatDate(vehicle.createdAt),
          formatDate(vehicle.updatedAt),
          serviceDuration,
          vehicle.totalAmount || 0,
          vehicle.paidAmount || 0,
          vehicle.paymentStatus || 'Unknown',
          vehicle.concerns,
          vehicle.insurance,
          vehicle.TinNo,
          vehicle.ChassisNo
        ]
      })

      // Create performance metrics
      const fastestService = Math.min(...filteredVehicles.map(v => calculateServiceDuration(v.createdAt, v.updatedAt)))
      const slowestService = Math.max(...filteredVehicles.map(v => calculateServiceDuration(v.createdAt, v.updatedAt)))
      const totalRevenue = filteredVehicles.reduce((acc, v) => acc + (v.totalAmount || 0), 0)
      const totalPaid = filteredVehicles.reduce((acc, v) => acc + (v.paidAmount || 0), 0)
      const outstanding = totalRevenue - totalPaid

      const metricsData = [
        [''],
        ['PERFORMANCE METRICS'],
        ['Fastest Service (days)', fastestService],
        ['Slowest Service (days)', slowestService],
        ['Total Revenue (RWF)', totalRevenue.toLocaleString()],
        ['Total Paid (RWF)', totalPaid.toLocaleString()],
        ['Outstanding Amount (RWF)', outstanding.toLocaleString()],
        ['Payment Completion Rate (%)', totalRevenue > 0 ? ((totalPaid / totalRevenue) * 100).toFixed(2) : 0]
      ]

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Summary worksheet
      const summaryWs = XLSX.utils.aoa_to_sheet([
        ...summaryData,
        headers,
        ...vehicleData,
        ...metricsData
      ])

      // Set column widths
      summaryWs['!cols'] = [
        {wch: 5}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 12}, 
        {wch: 20}, {wch: 15}, {wch: 25}, {wch: 18}, {wch: 18}, 
        {wch: 12}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 30}, 
        {wch: 15}, {wch: 15}, {wch: 18}
      ]

      XLSX.utils.book_append_sheet(wb, summaryWs, 'Cleared Vehicles Report')

      // Financial Summary worksheet
      const financialHeaders = ['Vehicle', 'Customer', 'Total Amount', 'Paid Amount', 'Outstanding', 'Payment Status']
      const financialData = filteredVehicles.map(vehicle => [
        `${vehicle.vehicleBrand} ${vehicle.vehicleType} - ${vehicle.PlateNo}`,
        vehicle.customer.name,
        vehicle.totalAmount || 0,
        vehicle.paidAmount || 0,
        (vehicle.totalAmount || 0) - (vehicle.paidAmount || 0),
        vehicle.paymentStatus || 'Unknown'
      ])

      const financialWs = XLSX.utils.aoa_to_sheet([
        ['AUTOHUB GARAGE - FINANCIAL SUMMARY'],
        [`Generated: ${new Date().toLocaleString()}`],
        [''],
        financialHeaders,
        ...financialData,
        [''],
        ['TOTALS'],
        ['Total Revenue', totalRevenue],
        ['Total Paid', totalPaid],
        ['Total Outstanding', outstanding]
      ])

      financialWs['!cols'] = [
        {wch: 30}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}
      ]

      XLSX.utils.book_append_sheet(wb, financialWs, 'Financial Summary')

      // Download the file
      XLSX.writeFile(wb, `AutoHub-Cleared-Vehicles-Report-${new Date().toISOString().split('T')[0]}.xlsx`)
      
      toast.success(`Excel report exported successfully! (${totalVehicles} vehicles included)`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.PlateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ChassisNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.paymentStatus === paymentFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'updatedAt':
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
          break
        case 'totalAmount':
          aValue = a.totalAmount || 0
          bValue = b.totalAmount || 0
          break
        case 'customerName':
          aValue = a.customer.name.toLowerCase()
          bValue = b.customer.name.toLowerCase()
          break
        case 'vehicleBrand':
          aValue = `${a.vehicleBrand} ${a.vehicleType}`.toLowerCase()
          bValue = `${b.vehicleBrand} ${b.vehicleType}`.toLowerCase()
          break
        default:
          aValue = a[sortBy]
          bValue = b[sortBy]
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredVehicles(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [vehicles, searchTerm, paymentFilter, sortBy, sortOrder])

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

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
            Showing {currentVehicles.length} of {filteredVehicles.length} completed services
            {filteredVehicles.length !== vehicles.filter(v => v.status === 'completed').length && 
              ` (${vehicles.filter(v => v.status === 'completed').length} total)`
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={exportAllReport}
            disabled={filteredVehicles.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel ({filteredVehicles.length})
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

      {/* Filters Section */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="partially-paid">Partially Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="updatedAt">Completion Date</option>
                  <option value="totalAmount">Total Amount</option>
                  <option value="customerName">Customer Name</option>
                  <option value="vehicleBrand">Vehicle Brand</option>
                  <option value="PlateNo">Plate Number</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        {currentVehicles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentVehicles.map((vehicle) => (
              <Card key={vehicle._id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {vehicle.image ? (
                          <img 
                            src={vehicle.image} 
                            alt="Vehicle"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                          {vehicle.vehicleBrand} {vehicle.vehicleType}
                          <Trophy className="h-4 w-4 text-green-600" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.ModelYear} • {vehicle.PlateNo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        COMPLETED
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculateServiceDuration(vehicle.createdAt, vehicle.updatedAt)} days
                      </p>
                    </div>
                  </div>

                  {/* Customer & Service Info */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-medium">{vehicle.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Service Period</p>
                      <p className="font-medium">{formatDate(vehicle.createdAt)}</p>
                      <p className="text-xs text-green-600">to {formatDate(vehicle.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Financial Info */}
                  {vehicle.totalAmount && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-bold text-lg text-green-600">
                            RWF {vehicle.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            vehicle.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : vehicle.paymentStatus === 'partially-paid'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {vehicle.paymentStatus?.replace('-', ' ').toUpperCase() || 'UNPAID'}
                          </span>
                          {vehicle.paidAmount && vehicle.paidAmount > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Paid: RWF {vehicle.paidAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Service Summary - Collapsible */}
                  {vehicle.quotation && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-800">
                          Service Summary
                        </p>
                        <p className="text-xs text-blue-600">
                          {vehicle.quotation.parts?.length || 0} items
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-blue-700">
                        <div>
                          <span className="text-blue-600">Parts: </span>
                          RWF {vehicle.quotation.summary?.partsTotal?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="text-blue-600">Service: </span>
                          RWF {vehicle.quotation.serviceCharge?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Original Concerns */}
                  <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Original Concerns:</p>
                    <p className="text-xs text-yellow-700 line-clamp-2">{vehicle.concerns}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <ViewVehicleModal 
                      vehicle={vehicle}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadVehicleReport(vehicle)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadVehicleInvoice(vehicle)}
                      className="flex-1"
                      disabled={!vehicle.totalAmount}
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm || paymentFilter !== 'all' ? 'No vehicles found' : 'No completed services yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || paymentFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters' 
                  : 'Completed vehicle services will appear here'
                }
              </p>
              {!searchTerm && paymentFilter === 'all' && (
                <Button variant="outline">
                  <Wrench className="h-4 w-4 mr-2" />
                  View In Service
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        className="w-10"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>
                
                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ClearedVehicles
