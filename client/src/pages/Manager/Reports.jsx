import React, { useState, useEffect } from 'react'
import { useManager } from '../../context/ManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import toast from 'react-hot-toast'
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Car,
  BarChart3,
  PieChart,
  FileBarChart,
  Filter,
  Search,
  Printer,
  Mail,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Share2,
  Archive,
  Package
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

const ManagerReports = () => {
  const { 
    reportsData, 
    loading, 
    generateManagerReports, 
    generatePayrollReport,
    fetchFinancialSummary,
    fetchInventoryReport
  } = useManager()

  const [selectedReport, setSelectedReport] = useState('financial')
  const [dateRange, setDateRange] = useState('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState(null)
  const [realTimeData, setRealTimeData] = useState({
    financial: null,
    inventory: null,
    operational: null,
    employee: null,
    customer: null,
    payroll: null
  })

  useEffect(() => {
    // Fetch initial real data
    loadInitialData()
  }, [])

  useEffect(() => {
    // Calculate start and end dates based on dateRange selection
    const now = new Date()
    let calculatedStartDate = ''
    let calculatedEndDate = ''

    switch (dateRange) {
      case 'week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))
        calculatedStartDate = startOfWeek.toISOString().split('T')[0]
        calculatedEndDate = endOfWeek.toISOString().split('T')[0]
        break
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        calculatedStartDate = startOfMonth.toISOString().split('T')[0]
        calculatedEndDate = endOfMonth.toISOString().split('T')[0]
        break
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3)
        const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1)
        const endOfQuarter = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0)
        calculatedStartDate = startOfQuarter.toISOString().split('T')[0]
        calculatedEndDate = endOfQuarter.toISOString().split('T')[0]
        break
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear(), 11, 31)
        calculatedStartDate = startOfYear.toISOString().split('T')[0]
        calculatedEndDate = endOfYear.toISOString().split('T')[0]
        break
      case 'custom':
        // Don't auto-calculate for custom range, let user set manually
        return
      default:
        return
    }

    setStartDate(calculatedStartDate)
    setEndDate(calculatedEndDate)
  }, [dateRange])

  useEffect(() => {
    // Auto-generate report when filters change (but not on initial mount)
    if (selectedReport && dateRange && startDate && endDate) {
      const timeoutId = setTimeout(() => {
        handleGenerateReport()
      }, 500) // Small delay to prevent rapid requests
      
      return () => clearTimeout(timeoutId)
    }
  }, [selectedReport, dateRange, startDate, endDate])

  const loadInitialData = async () => {
    try {
      // Generate current month reports by default
      const currentReports = await generateManagerReports({
        type: 'financial',
        dateRange: 'month'
      })
      
      if (currentReports) {
        setRealTimeData(prev => ({
          ...prev,
          ...currentReports
        }))
        
        // Set financial data as default
        if (currentReports.financial) {
          setReportData(currentReports.financial)
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load report data')
    }
  }

  const reportTypes = [
    { value: 'financial', label: 'Financial Report', icon: DollarSign },
    { value: 'operational', label: 'Operational Report', icon: BarChart3 },
    { value: 'employee', label: 'Employee Report', icon: Users },
    { value: 'customer', label: 'Customer Report', icon: Car },
    { value: 'inventory', label: 'Inventory Report', icon: FileBarChart },
  ]

  const dateRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handleGenerateReport = async () => {
    try {
      console.log('Generating report for:', selectedReport)
      let newReportData
      
      // Use the general manager reports function for all report types
      const filters = {
        type: selectedReport,
        dateRange,
        startDate,
        endDate
      }
      console.log('Filters being sent:', filters)
      
      const reports = await generateManagerReports(filters)
      console.log('Reports received:', reports)
      
      newReportData = reports?.[selectedReport]
      console.log('Specific report data:', newReportData)
      
      // Update real-time data state
      if (reports) {
        setRealTimeData(prev => ({
          ...prev,
          ...reports
        }))
      }
      
      if (newReportData) {
        setReportData(newReportData)
        toast.success('Report generated successfully')
      } else {
        console.warn(`No data found for ${selectedReport} report`)
        toast.warning(`No data available for ${selectedReport} report`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'service_payment': 'Service Payments',
      'parts_sales': 'Parts Sales',
      'consultation': 'Consultations',
      'insurance_claim': 'Insurance Claims',
      'other': 'Other Income',
      'parts_purchase': 'Parts Purchase',
      'equipment': 'Equipment',
      'utilities': 'Utilities',
      'rent': 'Rent',
      'salaries': 'Salaries',
      'insurance': 'Insurance',
      'maintenance': 'Maintenance',
      'fuel': 'Fuel',
      'marketing': 'Marketing',
      'supplies': 'Supplies'
    }
    return labels[category] || category
  }

  const exportToPDF = () => {
    if (!reportData) {
      toast.error('No report data to export. Please generate a report first.')
      return
    }
    
    try {
      // Create a simple PDF export by printing the page
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report - AutoHub</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
              .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>AutoHub - ${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="summary">
              ${selectedReport === 'financial' && reportData.summary ? `
                <div class="summary-card">
                  <h3>Total Revenue</h3>
                  <p>${formatCurrency(reportData.summary.totalRevenue)}</p>
                </div>
                <div class="summary-card">
                  <h3>Total Expenses</h3>
                  <p>${formatCurrency(reportData.summary.totalExpenses)}</p>
                </div>
                <div class="summary-card">
                  <h3>Net Profit</h3>
                  <p>${formatCurrency(reportData.summary.netProfit)}</p>
                </div>
                <div class="summary-card">
                  <h3>Profit Margin</h3>
                  <p>${reportData.summary.profitMargin}%</p>
                </div>
              ` : ''}
            </div>
            <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px;">Print Report</button>
          </body>
        </html>
      `)
      printWindow.document.close()
      toast.success('PDF export window opened')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    }
  }

  const exportToExcel = () => {
    if (!reportData) {
      toast.error('No report data to export. Please generate a report first.')
      return
    }

    try {
      let csvContent = "data:text/csv;charset=utf-8,"
      csvContent += `AutoHub ${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report\n`
      csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`

      if (selectedReport === 'financial' && reportData.summary) {
        csvContent += "Financial Summary\n"
        csvContent += "Metric,Amount\n"
        csvContent += `Total Revenue,${reportData.summary.totalRevenue}\n`
        csvContent += `Total Expenses,${reportData.summary.totalExpenses}\n`
        csvContent += `Net Profit,${reportData.summary.netProfit}\n`
        csvContent += `Profit Margin,${reportData.summary.profitMargin}%\n\n`

        if (reportData.incomeByCategory?.length > 0) {
          csvContent += "Income by Category\n"
          csvContent += "Category,Amount,Transactions\n"
          reportData.incomeByCategory.forEach(income => {
            csvContent += `${getCategoryLabel(income._id)},${income.total},${income.count}\n`
          })
        }
      }

      if (selectedReport === 'inventory' && reportData.lowStockParts?.length > 0) {
        csvContent += "Low Stock Parts\n"
        csvContent += "Part Number,Name,Category,Current Stock,Minimum Stock\n"
        reportData.lowStockParts.forEach(part => {
          csvContent += `${part.partNumber},${part.name},${part.category},${part.stockQuantity},${part.minimumStock}\n`
        })
      }

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `autohub-${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Excel file downloaded successfully')
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error('Failed to export Excel file')
    }
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

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
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive business intelligence and reporting</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button 
              onClick={exportToExcel} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              disabled={!reportData || loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Report Filters</span>
            </CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <select 
                  value={selectedReport} 
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {dateRange === 'custom' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              
              {dateRange !== 'custom' && (
                <div className="flex items-end">
                  <Button
                    onClick={handleGenerateReport}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                </div>
              )}
            </div>
            
            {dateRange === 'custom' && (startDate || endDate) && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleGenerateReport}
                  className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  disabled={loading || !startDate || !endDate}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Apply Custom Range
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Summary Cards - Different for each report type */}
        {reportData && (
          <div className="space-y-6">
            {/* Financial Report Summary */}
            {selectedReport === 'financial' && reportData.summary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-xl lg:text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.summary.totalRevenue)}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(reportData.summary.totalExpenses)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Profit</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(reportData.summary.netProfit)}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.summary.profitMargin}%
                      </p>
                    </div>
                    <Car className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Operational Report Summary */}
            {selectedReport === 'operational' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.totalVehicles || 0}
                      </p>
                    </div>
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {reportData.completedVehicles || 0}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Service Types</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.serviceStats?.length || 0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Inventory Report Summary */}
            {selectedReport === 'inventory' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData?.totalValue || 0)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-red-600">
                        {reportData?.totalLowStock || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData?.categoryStats?.length || 0}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Parts</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData?.categoryStats?.reduce((sum, cat) => sum + (cat.totalParts || 0), 0) || 0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.categoryStats?.length || 0}
                      </p>
                    </div>
                    <FileBarChart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-red-600">
                        {reportData.totalLowStock || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Parts</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.categoryStats?.reduce((sum, cat) => sum + cat.totalParts, 0) || 0}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Employee Report Summary */}
            {selectedReport === 'employee' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.totalEmployees || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.totalPayroll)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Departments</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.roleDistribution?.length || 0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Customer Report Summary */}
            {selectedReport === 'customer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.totalCustomers || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.totalRevenue)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Revenue/Customer</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(reportData.totalRevenue / (reportData.totalCustomers || 1))}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Payroll Report Summary */}
            {selectedReport === 'payroll' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(reportData.totalPayroll)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employees Paid</p>
                      <p className="text-2xl font-bold text-green-600">
                        {reportData.totalEmployeesPaid || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(reportData.totalPayroll / (reportData.totalEmployeesPaid || 1))}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Charts Section */}
        {loading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Generating report data...</p>
              </div>
            </CardContent>
          </Card>
        ) : reportData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Charts */}
          {selectedReport === 'financial' && reportData.monthlyTrend && (
            <>
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={reportData.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), '']}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        name="Expenses"
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Income Distribution</CardTitle>
                  <CardDescription>Revenue breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.incomeByCategory?.map(item => ({
                          name: getCategoryLabel(item._id),
                          value: item.total
                        })) || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(reportData.incomeByCategory || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Operational Charts */}
          {selectedReport === 'operational' && reportData.vehicleStats && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Status Distribution</CardTitle>
                  <CardDescription>Current status of all vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.vehicleStats.map(stat => ({
                          name: stat._id,
                          value: stat.count
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.vehicleStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Types</CardTitle>
                  <CardDescription>Services performed by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.serviceStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#3b82f6" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Inventory Charts */}
          {selectedReport === 'inventory' && reportData.categoryStats && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value by Category</CardTitle>
                  <CardDescription>Stock value distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                      <Legend />
                      <Bar dataKey="totalValue" fill="#10b981" name="Total Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Levels</CardTitle>
                  <CardDescription>Current stock quantities by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => value.toString()}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalStock" fill="#3b82f6" name="Total Stock" />
                      <Bar dataKey="lowStockItems" fill="#ef4444" name="Low Stock Items" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Employee Charts */}
          {selectedReport === 'employee' && reportData.roleDistribution && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Employee Distribution</CardTitle>
                  <CardDescription>Employees by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.roleDistribution.map(role => ({
                          name: role._id,
                          value: role.count
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Distribution</CardTitle>
                  <CardDescription>Total salary by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.roleDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                      <Legend />
                      <Bar dataKey="totalSalary" fill="#8b5cf6" name="Total Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Customer Charts */}
          {selectedReport === 'customer' && reportData.customerStats && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Revenue by customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.customerStats.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                      <Legend />
                      <Bar dataKey="totalAmount" fill="#10b981" name="Total Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Types</CardTitle>
                  <CardDescription>Distribution by vehicle type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.customerTypes?.map(type => ({
                          name: type._id,
                          value: type.count
                        })) || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(reportData.customerTypes || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* Payroll Charts */}
          {selectedReport === 'payroll' && reportData.payrollStats && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Payroll by Role</CardTitle>
                  <CardDescription>Salary distribution by employee role</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={reportData.payrollStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                      <Legend />
                      <Bar dataKey="totalPaid" fill="#8b5cf6" name="Total Paid" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Payroll Trend</CardTitle>
                  <CardDescription>Payroll expenses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={reportData.monthlyPayroll?.map(item => ({
                      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                      totalPaid: item.totalPaid,
                      employeeCount: item.employeeCount
                    })) || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => 
                          value > 1000000 ? `${(value/1000000).toFixed(1)}M` :
                          value > 1000 ? `${(value/1000).toFixed(0)}K` : 
                          value.toString()
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(value)]} />
                      <Legend />
                      <Line type="monotone" dataKey="totalPaid" stroke="#8b5cf6" name="Total Paid" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-gray-500">
                <FileText className="h-16 w-16" />
                <p className="text-lg font-medium">No Report Data</p>
                <p className="text-sm text-center">Select a report type and click "Generate Report" to view analytics</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Report Tables */}
        {reportData && (
          <>
          {/* Financial Report Table */}
          {selectedReport === 'financial' && reportData.incomeByCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Income & Expense Breakdown</CardTitle>
                <CardDescription>Detailed financial analysis by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-600">Category</th>
                        <th className="text-left p-4 font-medium text-gray-600">Type</th>
                        <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left p-4 font-medium text-gray-600">Transactions</th>
                        <th className="text-left p-4 font-medium text-gray-600">Avg. Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.incomeByCategory?.map((income, index) => (
                        <tr key={`income-${index}`} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: '#10b981' }}
                              ></div>
                              <span className="font-medium">{getCategoryLabel(income._id)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-800">Income</Badge>
                          </td>
                          <td className="p-4 font-medium text-green-600">
                            {formatCurrency(income.total)}
                          </td>
                          <td className="p-4">{income.count}</td>
                          <td className="p-4">
                            {formatCurrency(income.total / income.count)}
                          </td>
                        </tr>
                      ))}
                      {reportData.expenseByCategory?.map((expense, index) => (
                        <tr key={`expense-${index}`} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: '#ef4444' }}
                              ></div>
                              <span className="font-medium">{getCategoryLabel(expense._id)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-red-100 text-red-800">Expense</Badge>
                          </td>
                          <td className="p-4 font-medium text-red-600">
                            -{formatCurrency(expense.total)}
                          </td>
                          <td className="p-4">{expense.count}</td>
                          <td className="p-4">
                            {formatCurrency(expense.total / expense.count)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inventory Report Table */}
          {selectedReport === 'inventory' && reportData.lowStockParts && (
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Parts requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-600">Part Number</th>
                        <th className="text-left p-4 font-medium text-gray-600">Name</th>
                        <th className="text-left p-4 font-medium text-gray-600">Category</th>
                        <th className="text-left p-4 font-medium text-gray-600">Current Stock</th>
                        <th className="text-left p-4 font-medium text-gray-600">Minimum Stock</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.lowStockParts.map((part, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium text-blue-600">{part.partNumber}</td>
                          <td className="p-4">{part.name}</td>
                          <td className="p-4">{part.category}</td>
                          <td className="p-4 font-medium">
                            {part.stockQuantity}
                          </td>
                          <td className="p-4">{part.minimumStock}</td>
                          <td className="p-4">
                            <Badge className={
                              part.stockQuantity === 0 ? 'bg-red-100 text-red-800' :
                              part.stockQuantity <= part.minimumStock / 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {part.stockQuantity === 0 ? 'Out of Stock' :
                               part.stockQuantity <= part.minimumStock / 2 ? 'Critical' : 'Low Stock'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employee Report Table */}
          {selectedReport === 'employee' && reportData.recentPayroll && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Payroll</CardTitle>
                <CardDescription>Latest salary payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-600">Employee</th>
                        <th className="text-left p-4 font-medium text-gray-600">Role</th>
                        <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left p-4 font-medium text-gray-600">Payment Date</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.recentPayroll.map((payment, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">
                                {payment.employeeId?.firstName} {payment.employeeId?.lastName}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 capitalize">{payment.employeeId?.role}</td>
                          <td className="p-4 font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="p-4">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Operational Report Table */}
          {selectedReport === 'operational' && reportData.serviceStats && (
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Service statistics by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-600">Service Type</th>
                        <th className="text-left p-4 font-medium text-gray-600">Count</th>
                        <th className="text-left p-4 font-medium text-gray-600">Total Cost</th>
                        <th className="text-left p-4 font-medium text-gray-600">Avg. Cost</th>
                        <th className="text-left p-4 font-medium text-gray-600">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.serviceStats.map((service, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              ></div>
                              <span className="font-medium">{service._id}</span>
                            </div>
                          </td>
                          <td className="p-4">{service.count}</td>
                          <td className="p-4 font-medium">
                            {formatCurrency(service.totalCost)}
                          </td>
                          <td className="p-4">
                            {formatCurrency(service.totalCost / service.count)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm">Good</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      </div>
    </div>
  )
}

export default ManagerReports
