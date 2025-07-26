import React, { useEffect, useState } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import * as XLSX from 'xlsx'
import { 
  Plus, 
  Search, 
  TrendingDown,
  Calendar,
  CreditCard,
  FileText,
  X,
  Edit,
  Trash2,
  Receipt,
  Download
} from 'lucide-react'

// Expense Modal - moved outside component to prevent re-rendering
const ExpenseModal = ({ show, editingExpense, expenseData, setExpenseData, onClose, onSubmit, expenseCategories }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {editingExpense ? 'Edit Expense Record' : 'Add Expense Record'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Input
              value={expenseData.description}
              onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
              placeholder="Enter expense description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Amount (RWF) *</label>
            <Input
              type="number"
              value={expenseData.amount}
              onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={expenseData.category}
              onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {expenseCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <Input
              type="date"
              value={expenseData.date}
              onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={expenseData.paymentMethod}
              onChange={(e) => setExpenseData({...expenseData, paymentMethod: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Supplier/Vendor</label>
            <Input
              value={expenseData.supplier}
              onChange={(e) => setExpenseData({...expenseData, supplier: e.target.value})}
              placeholder="Supplier or vendor name (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Receipt Number</label>
            <Input
              value={expenseData.receiptNumber}
              onChange={(e) => setExpenseData({...expenseData, receiptNumber: e.target.value})}
              placeholder="Receipt or invoice number (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={expenseData.notes}
              onChange={(e) => setExpenseData({...expenseData, notes: e.target.value})}
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
            disabled={!expenseData.description || !expenseData.amount}
          >
            {editingExpense ? 'Update' : 'Create'} Expense
          </Button>
        </div>
      </div>
    </div>
  )
}

const ExpenseManagement = () => {
  const { 
    expenseRecords, 
    loading, 
    fetchExpenseRecords,
    createExpenseRecord,
    updateExpenseRecord,
    deleteExpenseRecord
  } = useAccountant()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [filteredRecords, setFilteredRecords] = useState([])
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    category: 'parts_purchase',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    supplier: '',
    receiptNumber: '',
    notes: ''
  })

  const expenseCategories = [
    { value: 'parts_purchase', label: 'Parts Purchase' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'salaries', label: 'Salaries' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'other', label: 'Other Expenses' }
  ]

  useEffect(() => {
    fetchExpenseRecords()
  }, [])

  useEffect(() => {
    let filtered = expenseRecords || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [expenseRecords, searchTerm, categoryFilter, dateFilter])

  const handleAddExpense = () => {
    setEditingExpense(null)
    setExpenseData({
      description: '',
      amount: '',
      category: 'parts_purchase',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      supplier: '',
      receiptNumber: '',
      notes: ''
    })
    setShowExpenseModal(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setExpenseData({
      description: expense.description || '',
      amount: expense.amount || '',
      category: expense.category || 'parts_purchase',
      date: new Date(expense.date).toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || 'cash',
      supplier: expense.supplier || '',
      receiptNumber: expense.receiptNumber || '',
      notes: expense.notes || ''
    })
    setShowExpenseModal(true)
  }

  const submitExpense = async () => {
    console.log('submitExpense called with data:', expenseData)
    console.log('editingExpense:', editingExpense)
    
    // Validate required fields
    if (!expenseData.description || !expenseData.amount) {
      console.error('Missing required fields:', {
        description: expenseData.description,
        amount: expenseData.amount
      })
      return
    }
    
    // Prepare data with proper types
    const processedData = {
      ...expenseData,
      amount: parseFloat(expenseData.amount) || 0
    }
    
    try {
      if (editingExpense) {
        console.log('Updating expense record...')
        const result = await updateExpenseRecord(editingExpense._id, processedData)
        console.log('Update result:', result)
      } else {
        console.log('Creating new expense record...')
        console.log('Data being sent to backend:', JSON.stringify(processedData, null, 2))
        const result = await createExpenseRecord(processedData)
        console.log('Create result:', result)
      }
      console.log('Operation successful, closing modal...')
      setShowExpenseModal(false)
      setEditingExpense(null)
      console.log('Fetching updated records...')
      await fetchExpenseRecords()
    } catch (error) {
      console.error('Failed to save expense record:', error)
      console.error('Error details:', error.response?.data || error.message)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await deleteExpenseRecord(expenseId)
        fetchExpenseRecords()
      } catch (error) {
        console.error('Failed to delete expense record:', error)
      }
    }
  }

  const exportToExcel = () => {
    if (!filteredRecords || filteredRecords.length === 0) {
      alert('No expense records to export')
      return
    }

    // Prepare data for Excel export
    const exportData = filteredRecords.map((expense, index) => ({
      'S/N': index + 1,
      'Reference Number': expense.referenceNumber || 'N/A',
      'Date': new Date(expense.date).toLocaleDateString(),
      'Description': expense.description,
      'Category': getCategoryLabel(expense.category),
      'Amount (RWF)': expense.amount,
      'Payment Method': expense.paymentMethod,
      'Supplier/Vendor': expense.supplier || 'N/A',
      'Receipt Number': expense.receiptNumber || 'N/A',
      'Notes': expense.notes || 'N/A',
      'Status': expense.status || 'paid',
      'Created Date': new Date(expense.createdAt).toLocaleDateString()
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Auto-size columns
    const colWidths = [
      { wch: 5 },   // S/N
      { wch: 18 },  // Reference Number
      { wch: 12 },  // Date
      { wch: 30 },  // Description
      { wch: 15 },  // Category
      { wch: 15 },  // Amount
      { wch: 15 },  // Payment Method
      { wch: 20 },  // Supplier
      { wch: 15 },  // Receipt Number
      { wch: 25 },  // Notes
      { wch: 10 },  // Status
      { wch: 15 }   // Created Date
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Expense Records')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `AutoHub_Expense_Records_${currentDate}.xlsx`

    // Download the file
    XLSX.writeFile(wb, filename)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'parts_purchase': return 'bg-red-500'
      case 'equipment': return 'bg-blue-500'
      case 'utilities': return 'bg-yellow-500'
      case 'rent': return 'bg-purple-500'
      case 'salaries': return 'bg-green-500'
      case 'insurance': return 'bg-indigo-500'
      case 'maintenance': return 'bg-orange-500'
      case 'fuel': return 'bg-gray-500'
      case 'marketing': return 'bg-pink-500'
      case 'supplies': return 'bg-teal-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category) => {
    const cat = expenseCategories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const totalExpenses = filteredRecords.reduce((sum, record) => sum + (record.amount || 0), 0)
  const todayExpenses = filteredRecords
    .filter(record => new Date(record.date).toDateString() === new Date().toDateString())
    .reduce((sum, record) => sum + (record.amount || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading expense records...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track and manage all business expenses</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            disabled={filteredRecords.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button onClick={handleAddExpense}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses (Filtered)</p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {todayExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600" />
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
                  placeholder="Search by description, supplier, or receipt..."
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
                {expenseCategories.map(cat => (
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

      {/* Expense Records */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>All recorded business expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getCategoryColor(expense.category)} text-white`}>
                      {getCategoryLabel(expense.category)}
                    </Badge>
                    <h3 className="font-medium">{expense.description}</h3>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <span>Amount: RWF {expense.amount?.toLocaleString()}</span>
                    <span>Date: {new Date(expense.date).toLocaleDateString()}</span>
                    <span>Method: {expense.paymentMethod}</span>
                    {expense.supplier && <span>Supplier: {expense.supplier}</span>}
                  </div>
                  {expense.receiptNumber && (
                    <div className="mt-1 text-sm text-gray-500">
                      Receipt: {expense.receiptNumber}
                    </div>
                  )}
                  {expense.notes && (
                    <p className="mt-1 text-sm text-gray-500">{expense.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditExpense(expense)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="text-red-600 border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No expense records found</h3>
                <p>
                  {searchTerm || categoryFilter !== 'all' || dateFilter
                    ? 'Try adjusting your filters'
                    : 'Start by adding your first expense record'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <ExpenseModal 
        show={showExpenseModal}
        editingExpense={editingExpense}
        expenseData={expenseData}
        setExpenseData={setExpenseData}
        onClose={() => setShowExpenseModal(false)}
        onSubmit={submitExpense}
        expenseCategories={expenseCategories}
      />
    </div>
  )
}

export default ExpenseManagement
