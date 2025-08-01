import React, { useEffect, useState } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Plus, 
  Search, 
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Filter,
  X,
  Edit,
  Trash2,
  Download
} from 'lucide-react'
import * as XLSX from 'xlsx'

// Income Modal - moved outside component to prevent re-rendering
const IncomeModal = ({ show, editingIncome, incomeData, setIncomeData, onClose, onSubmit, incomeCategories }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {editingIncome ? 'Edit Income Record' : 'Add Income Record'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Input
              value={incomeData.description}
              onChange={(e) => setIncomeData({...incomeData, description: e.target.value})}
              placeholder="Enter income description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Amount (RWF) *</label>
            <Input
              type="number"
              value={incomeData.amount}
              onChange={(e) => setIncomeData({...incomeData, amount: e.target.value})}
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={incomeData.category}
              onChange={(e) => setIncomeData({...incomeData, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {incomeCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <Input
              type="date"
              value={incomeData.date}
              onChange={(e) => setIncomeData({...incomeData, date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={incomeData.paymentMethod}
              onChange={(e) => setIncomeData({...incomeData, paymentMethod: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <Input
              value={incomeData.customerName}
              onChange={(e) => setIncomeData({...incomeData, customerName: e.target.value})}
              placeholder="Customer name (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Reference</label>
            <Input
              value={incomeData.vehicleRef}
              onChange={(e) => setIncomeData({...incomeData, vehicleRef: e.target.value})}
              placeholder="Vehicle plate or reference (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={incomeData.notes}
              onChange={(e) => setIncomeData({...incomeData, notes: e.target.value})}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!incomeData.description || !incomeData.amount}
          >
            {editingIncome ? 'Update' : 'Create'} Income
          </Button>
        </div>
      </div>
    </div>
  )
}

const IncomeManagement = () => {
  const { 
    incomeRecords, 
    loading, 
    fetchIncomeRecords,
    createIncomeRecord,
    updateIncomeRecord,
    deleteIncomeRecord
  } = useAccountant()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [filteredRecords, setFilteredRecords] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 10 items per page for table
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)
  const [incomeData, setIncomeData] = useState({
    description: '',
    amount: '',
    category: 'service_payment',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    customerName: '',
    vehicleRef: '',
    notes: ''
  })

  const incomeCategories = [
    { value: 'service_payment', label: 'Service Payment' },
    { value: 'parts_sales', label: 'Parts Sales' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'insurance_claim', label: 'Insurance Claim' },
    { value: 'other', label: 'Other Income' }
  ]

  useEffect(() => {
    fetchIncomeRecords()
  }, [])

  useEffect(() => {
    let filtered = incomeRecords || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vehicleRef?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(record => record.category === categoryFilter)
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(record => 
        new Date(record.date).toDateString() === new Date(dateFilter).toDateString()
      )
    }

    setFilteredRecords(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [incomeRecords, searchTerm, categoryFilter, dateFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecords = filteredRecords.slice(startIndex, endIndex)

  const handleAddIncome = () => {
    setEditingIncome(null)
    setIncomeData({
      description: '',
      amount: '',
      category: 'service_payment',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      customerName: '',
      vehicleRef: '',
      notes: ''
    })
    setShowIncomeModal(true)
  }

  const handleEditIncome = (income) => {
    setEditingIncome(income)
    setIncomeData({
      description: income.description || '',
      amount: income.amount || '',
      category: income.category || 'service_payment',
      date: new Date(income.date).toISOString().split('T')[0],
      paymentMethod: income.paymentMethod || 'cash',
      customerName: income.customerName || '',
      vehicleRef: income.vehicleRef || '',
      notes: income.notes || ''
    })
    setShowIncomeModal(true)
  }

  const submitIncome = async () => {
    console.log('submitIncome called with data:', incomeData)
    console.log('editingIncome:', editingIncome)
    
    try {
      if (editingIncome) {
        console.log('Updating income record...')
        await updateIncomeRecord(editingIncome._id, incomeData)
      } else {
        console.log('Creating new income record...')
        await createIncomeRecord(incomeData)
      }
      console.log('Operation successful, closing modal...')
      setShowIncomeModal(false)
      setEditingIncome(null)
      console.log('Fetching updated records...')
      fetchIncomeRecords()
    } catch (error) {
      console.error('Failed to save income record:', error)
    }
  }

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncomeRecord(incomeId)
        fetchIncomeRecords()
      } catch (error) {
        console.error('Failed to delete income record:', error)
      }
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'service_payment': return 'bg-blue-500'
      case 'parts_sales': return 'bg-green-500'
      case 'consultation': return 'bg-purple-500'
      case 'insurance_claim': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category) => {
    const cat = incomeCategories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const exportToExcel = () => {
    // Prepare data for Excel export
    const exportData = filteredRecords.map(record => ({
      'Date': new Date(record.date).toLocaleDateString(),
      'Description': record.description,
      'Category': getCategoryLabel(record.category),
      'Amount (RWF)': record.amount,
      'Payment Method': record.paymentMethod,
      'Phone Number': record.phoneNumber || '',
      'Account Number': record.accountNumber || '',
      'Customer Name': record.customerName || '',
      'Vehicle Reference': record.vehicleRef || '',
      'Reference Number': record.referenceNumber || '',
      'Notes': record.notes || ''
    }))

    // Add summary row
    exportData.push({
      'Date': '',
      'Description': 'TOTAL',
      'Category': '',
      'Amount (RWF)': totalIncome,
      'Payment Method': '',
      'Phone Number': '',
      'Account Number': '',
      'Customer Name': '',
      'Vehicle Reference': '',
      'Reference Number': '',
      'Notes': `Export generated on ${new Date().toLocaleDateString()}`
    })

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    
    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 30 }, // Description
      { wch: 15 }, // Category
      { wch: 15 }, // Amount
      { wch: 15 }, // Payment Method
      { wch: 15 }, // Phone Number
      { wch: 18 }, // Account Number
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Vehicle Reference
      { wch: 20 }, // Reference Number
      { wch: 30 }  // Notes
    ]
    ws['!cols'] = colWidths

    // Style the total row
    const totalRowIndex = exportData.length
    const totalRowRange = XLSX.utils.encode_range({
      s: { c: 0, r: totalRowIndex },
      e: { c: 10, r: totalRowIndex }
    })

    XLSX.utils.book_append_sheet(wb, ws, 'Income Records')
    
    // Generate filename with current date and filters
    let filename = `AutoHub_Income_Records_${new Date().toISOString().split('T')[0]}`
    if (categoryFilter !== 'all') {
      filename += `_${categoryFilter}`
    }
    if (dateFilter) {
      filename += `_${dateFilter}`
    }
    filename += '.xlsx'

    // Save file
    XLSX.writeFile(wb, filename)
  }

  const totalIncome = filteredRecords.reduce((sum, record) => sum + (record.amount || 0), 0)
  const todayIncome = filteredRecords
    .filter(record => new Date(record.date).toDateString() === new Date().toDateString())
    .reduce((sum, record) => sum + (record.amount || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading income records...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600">Track and manage all income sources</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportToExcel}
            variant="outline"
            disabled={filteredRecords.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button onClick={handleAddIncome}>
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income (Filtered)</p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {todayIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by description, customer, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {incomeCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
            {(searchTerm || categoryFilter !== 'all' || dateFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setDateFilter('')
                }}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Income Records */}
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <CardDescription>
            All recorded income transactions 
            {filteredRecords.length > 0 && (
              <span className="ml-2">
                (Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentRecords.map((income) => (
              <div key={income._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getCategoryColor(income.category)} text-white`}>
                      {getCategoryLabel(income.category)}
                    </Badge>
                    <h3 className="font-medium">{income.description}</h3>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <span>Amount: RWF {income.amount?.toLocaleString()}</span>
                    <span>Date: {new Date(income.date).toLocaleDateString()}</span>
                    <span>Method: {income.paymentMethod}</span>
                    {income.customerName && <span>Customer: {income.customerName}</span>}
                    {income.vehicleRef && <span>Vehicle: {income.vehicleRef}</span>}
                    {income.phoneNumber && <span>Phone: {income.phoneNumber}</span>}
                    {income.accountNumber && <span>Account: {income.accountNumber}</span>}
                    {income.referenceNumber && <span>Ref: {income.referenceNumber}</span>}
                  </div>
                  {income.notes && (
                    <p className="mt-1 text-sm text-gray-500">{income.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditIncome(income)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteIncome(income._id)}
                    className="text-red-600 border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No income records found</h3>
                <p>
                  {searchTerm || categoryFilter !== 'all' || dateFilter
                    ? 'Try adjusting your filters'
                    : 'Start by adding your first income record'
                  }
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
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
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <IncomeModal 
        show={showIncomeModal}
        editingIncome={editingIncome}
        incomeData={incomeData}
        setIncomeData={setIncomeData}
        onClose={() => setShowIncomeModal(false)}
        onSubmit={submitIncome}
        incomeCategories={incomeCategories}
      />
    </div>
  )
}

export default IncomeManagement
