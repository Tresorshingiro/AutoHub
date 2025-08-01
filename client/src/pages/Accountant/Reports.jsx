import React, { useState, useEffect } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Filter,
  PrinterIcon,
  FileSpreadsheet,
  X
} from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Reports = () => {
  const { 
    expenseRecords,
    incomeRecords,
    partsInventory,
    fetchExpenseRecords,
    fetchIncomeRecords,
    fetchPartsInventory,
    loading
  } = useAccountant()

  const [reportType, setReportType] = useState('expenses')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [reportStats, setReportStats] = useState({
    totalAmount: 0,
    recordCount: 0,
    averageAmount: 0
  })

  useEffect(() => {
    fetchExpenseRecords()
    fetchIncomeRecords()
    fetchPartsInventory()
  }, [])

  useEffect(() => {
    // Set default date range (current month)
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    generateReport()
  }, [reportType, startDate, endDate, expenseRecords, incomeRecords, partsInventory])

  const generateReport = () => {
    let data = []
    
    switch (reportType) {
      case 'expenses':
        data = expenseRecords || []
        break
      case 'income':
        data = incomeRecords || []
        break
      case 'stock':
        data = partsInventory || []
        break
      default:
        data = []
    }

    // Filter by date range for expenses and income
    if (reportType !== 'stock' && startDate && endDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.date || item.createdAt)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return itemDate >= start && itemDate <= end
      })
    }

    setFilteredData(data)

    // Calculate stats
    if (reportType === 'stock') {
      const totalValue = data.reduce((sum, item) => 
        sum + ((item.inventory?.currentStock || 0) * (item.pricing?.sellingPrice || 0)), 0
      )
      setReportStats({
        totalAmount: totalValue,
        recordCount: data.length,
        averageAmount: data.length > 0 ? totalValue / data.length : 0
      })
    } else {
      const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0)
      setReportStats({
        totalAmount,
        recordCount: data.length,
        averageAmount: data.length > 0 ? totalAmount / data.length : 0
      })
    }
  }

  const exportToExcel = () => {
    let exportData = []
    let filename = ''

    switch (reportType) {
      case 'expenses':
        exportData = filteredData.map(item => ({
          Date: new Date(item.date).toLocaleDateString(),
          Description: item.description || '',
          Category: item.category || '',
          Amount: item.amount || 0,
          'Payment Method': item.paymentMethod || '',
          Supplier: typeof item.supplier === 'object' ? item.supplier?.name || 'N/A' : item.supplier || 'N/A',
          Notes: item.notes || 'N/A'
        }))
        filename = `Expenses_Report_${startDate}_to_${endDate}`
        break
      case 'income':
        exportData = filteredData.map(item => ({
          Date: new Date(item.date).toLocaleDateString(),
          Description: item.description || '',
          'Phone Number': item.phoneNumber || 'N/A',
          'Bank Account': item.accountNumber || 'N/A',
          Amount: item.amount || 0,
          'Payment Method': item.paymentMethod || '',
          'Customer Name': item.customerName || 'N/A',
          Notes: item.notes || 'N/A'
        }))
        filename = `Income_Report_${startDate}_to_${endDate}`
        break
      case 'stock':
        exportData = filteredData.map(item => ({
          'Part Name': item.name || '',
          'Part Number': item.partNumber || 'N/A',
          Category: item.category || '',
          'Current Stock': item.inventory?.currentStock || 0,
          'Minimum Stock': item.inventory?.minimumStock || 0,
          'Unit Price': item.pricing?.sellingPrice || 0,
          'Total Value': (item.inventory?.currentStock || 0) * (item.pricing?.sellingPrice || 0),
          Location: item.location || item.inventory?.location?.warehouse || 'N/A',
          Supplier: typeof item.supplier === 'object' ? item.supplier?.name : item.supplier || 'N/A',
          Status: (item.inventory?.currentStock || 0) === 0 ? 'Out of Stock' : 
                  (item.inventory?.currentStock || 0) <= (item.inventory?.minimumStock || 0) ? 'Low Stock' : 'In Stock'
        }))
        filename = `Stock_Report_${new Date().toISOString().split('T')[0]}`
        break
    }

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, reportType.charAt(0).toUpperCase() + reportType.slice(1))
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    let title = ''
    let headers = []
    let rows = []

    switch (reportType) {
      case 'expenses':
        title = `Expenses Report (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})`
        headers = ['Date', 'Description', 'Category', 'Amount (RWF)', 'Payment Method', 'Supplier']
        rows = filteredData.map(item => [
          new Date(item.date).toLocaleDateString(),
          item.description || '',
          item.category || '',
          (item.amount || 0).toLocaleString(),
          item.paymentMethod || '',
          typeof item.supplier === 'object' ? item.supplier?.name || 'N/A' : item.supplier || 'N/A'
        ])
        break
      case 'income':
        title = `Income Report (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})`
        headers = ['Date', 'Description', 'Phone Number', 'Bank Account', 'Amount (RWF)', 'Payment Method', 'Customer']
        rows = filteredData.map(item => [
          new Date(item.date).toLocaleDateString(),
          item.description || '',
          item.phoneNumber || 'N/A',
          item.accountNumber || 'N/A',
          (item.amount || 0).toLocaleString(),
          item.paymentMethod || '',
          item.customerName || 'N/A'
        ])
        break
      case 'stock':
        title = `Stock Report (${new Date().toLocaleDateString()})`
        headers = ['Part Name', 'Part Number', 'Category', 'Stock', 'Unit Price', 'Total Value', 'Status']
        rows = filteredData.map(item => [
          item.name || '',
          item.partNumber || 'N/A',
          item.category || '',
          item.inventory?.currentStock || 0,
          (item.pricing?.sellingPrice || 0).toLocaleString(),
          ((item.inventory?.currentStock || 0) * (item.pricing?.sellingPrice || 0)).toLocaleString(),
          (item.inventory?.currentStock || 0) === 0 ? 'Out of Stock' : 
          (item.inventory?.currentStock || 0) <= (item.inventory?.minimumStock || 0) ? 'Low Stock' : 'In Stock'
        ])
        break
    }

    // Add title
    doc.setFontSize(16)
    doc.text(title, 14, 22)

    // Add summary stats
    doc.setFontSize(10)
    doc.text(`Total Records: ${reportStats.recordCount}`, 14, 35)
    if (reportType !== 'stock') {
      doc.text(`Total Amount: RWF ${reportStats.totalAmount.toLocaleString()}`, 14, 42)
      doc.text(`Average Amount: RWF ${reportStats.averageAmount.toLocaleString()}`, 14, 49)
    } else {
      doc.text(`Total Inventory Value: RWF ${reportStats.totalAmount.toLocaleString()}`, 14, 42)
    }

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 55,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    })

    // Save the PDF
    const filename = reportType === 'stock' 
      ? `Stock_Report_${new Date().toISOString().split('T')[0]}.pdf`
      : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_Report_${startDate}_to_${endDate}.pdf`
    
    doc.save(filename)
  }

  const printReport = () => {
    setShowPreview(true)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const getReportIcon = (type) => {
    switch (type) {
      case 'expenses': return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'income': return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'stock': return <Package className="w-5 h-5 text-blue-600" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getReportColor = (type) => {
    switch (type) {
      case 'expenses': return 'text-red-600 bg-red-50 border-red-200'
      case 'income': return 'text-green-600 bg-green-50 border-green-200'
      case 'stock': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reports data...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export financial and inventory reports</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={printReport} variant="outline">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Configuration
          </CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <div className="space-y-2">
                {[
                  { value: 'expenses', label: 'Expenses Report', icon: TrendingDown, color: 'text-red-600' },
                  { value: 'income', label: 'Income Report', icon: TrendingUp, color: 'text-green-600' },
                  { value: 'stock', label: 'Stock Report', icon: Package, color: 'text-blue-600' }
                ].map(({ value, label, icon: Icon, color }) => (
                  <div key={value} className="flex items-center">
                    <input
                      type="radio"
                      id={value}
                      name="reportType"
                      value={value}
                      checked={reportType === value}
                      onChange={(e) => setReportType(e.target.value)}
                      className="mr-3"
                    />
                    <label htmlFor={value} className="flex items-center cursor-pointer">
                      <Icon className={`w-4 h-4 mr-2 ${color}`} />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range (only for expenses and income) */}
            {reportType !== 'stock' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.recordCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {reportType === 'stock' ? 'Total Value' : 'Total Amount'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {reportStats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {reportType !== 'stock' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {reportStats.averageAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getReportIcon(reportType)}
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Preview
          </CardTitle>
          <CardDescription>
            {reportType === 'stock' 
              ? `Current inventory status as of ${new Date().toLocaleDateString()}`
              : `Data from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {reportType === 'expenses' && (
                    <>
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Payment Method</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Supplier</th>
                    </>
                  )}
                  {reportType === 'income' && (
                    <>
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Phone Number</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Bank Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Payment Method</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                    </>
                  )}
                  {reportType === 'stock' && (
                    <>
                      <th className="border border-gray-300 px-4 py-2 text-left">Part Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Part Number</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Stock</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total Value</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {reportType === 'expenses' && (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.description || ''}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.category || ''}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          RWF {(item.amount || 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.paymentMethod || ''}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {typeof item.supplier === 'object' ? item.supplier?.name || 'N/A' : item.supplier || 'N/A'}
                        </td>
                      </>
                    )}
                    {reportType === 'income' && (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.description || ''}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.phoneNumber || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.accountNumber || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          RWF {(item.amount || 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.paymentMethod || ''}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.customerName || 'N/A'}</td>
                      </>
                    )}
                    {reportType === 'stock' && (
                      <>
                        <td className="border border-gray-300 px-4 py-2">{item.name || ''}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.partNumber || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.category || ''}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {item.inventory?.currentStock || 0}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          RWF {(item.pricing?.sellingPrice || 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          RWF {((item.inventory?.currentStock || 0) * (item.pricing?.sellingPrice || 0)).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            (item.inventory?.currentStock || 0) === 0 
                              ? 'bg-red-100 text-red-800' 
                              : (item.inventory?.currentStock || 0) <= (item.inventory?.minimumStock || 0)
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {(item.inventory?.currentStock || 0) === 0 ? 'Out of Stock' : 
                             (item.inventory?.currentStock || 0) <= (item.inventory?.minimumStock || 0) ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 10 && (
              <div className="mt-4 text-center text-gray-600">
                Showing first 10 records. Export to see all {filteredData.length} records.
              </div>
            )}
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data found for the selected criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports
