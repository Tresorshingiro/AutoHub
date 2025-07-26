import React, { useEffect, useState } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Plus, 
  Search, 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Edit,
  Trash2,
  ExternalLink,
  Truck,
  DollarSign
} from 'lucide-react'

// Part Modal - moved outside component to prevent re-rendering
const PartModal = ({ show, editingPart, partData, setPartData, onClose, onSubmit, partCategories, suppliers }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {editingPart ? 'Edit Part' : 'Add New Part'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Part Name *</label>
            <Input
              value={partData.name}
              onChange={(e) => setPartData({...partData, name: e.target.value})}
              placeholder="Enter part name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Part Number</label>
            <Input
              value={partData.partNumber}
              onChange={(e) => setPartData({...partData, partNumber: e.target.value})}
              placeholder="Part number or SKU"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={partData.category}
              onChange={(e) => setPartData({...partData, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select category</option>
              {partCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity *</label>
              <Input
                type="number"
                value={partData.quantity}
                onChange={(e) => setPartData({...partData, quantity: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Stock Level</label>
              <Input
                type="number"
                value={partData.minStockLevel}
                onChange={(e) => setPartData({...partData, minStockLevel: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Unit Price (RWF) *</label>
            <Input
              type="number"
              value={partData.unitPrice}
              onChange={(e) => setPartData({...partData, unitPrice: e.target.value})}
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Supplier</label>
            <select
              value={partData.supplier}
              onChange={(e) => setPartData({...partData, supplier: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select supplier</option>
              {suppliers?.map(supplier => (
                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={partData.location}
              onChange={(e) => setPartData({...partData, location: e.target.value})}
              placeholder="Storage location (e.g., Shelf A1)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={partData.description}
              onChange={(e) => setPartData({...partData, description: e.target.value})}
              placeholder="Part description..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!partData.name || !partData.category || !partData.quantity || !partData.unitPrice}
          >
            {editingPart ? 'Update' : 'Create'} Part
          </Button>
        </div>
      </div>
    </div>
  )
}

// Supplier Modal - moved outside component to prevent re-rendering
const SupplierModal = ({ show, editingSupplier, supplierData, setSupplierData, onClose, onSubmit }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name *</label>
            <Input
              value={supplierData.name}
              onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Contact Person *</label>
            <Input
              value={supplierData.contactPerson}
              onChange={(e) => setSupplierData({...supplierData, contactPerson: e.target.value})}
              placeholder="Contact person name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={supplierData.email}
              onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
              placeholder="Email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone *</label>
            <Input
              value={supplierData.phone}
              onChange={(e) => setSupplierData({...supplierData, phone: e.target.value})}
              placeholder="Phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">TIN Number</label>
            <Input
              value={supplierData.tinNumber}
              onChange={(e) => setSupplierData({...supplierData, tinNumber: e.target.value})}
              placeholder="Tax Identification Number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="2"
              value={supplierData.address}
              onChange={(e) => setSupplierData({...supplierData, address: e.target.value})}
              placeholder="Company address..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              value={supplierData.notes}
              onChange={(e) => setSupplierData({...supplierData, notes: e.target.value})}
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
            disabled={!supplierData.name || !supplierData.contactPerson || !supplierData.email || !supplierData.phone || !supplierData.address}
          >
            {editingSupplier ? 'Update' : 'Create'} Supplier
          </Button>
        </div>
      </div>
    </div>
  )
}

const EnhancedInventory = () => {
  const { 
    partsInventory, 
    suppliers,
    loading, 
    fetchPartsInventory,
    fetchSuppliers,
    createPart,
    updatePart,
    deletePart,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    createExpenseRecord
  } = useAccountant()

  const [activeTab, setActiveTab] = useState('parts')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [filteredParts, setFilteredParts] = useState([])
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [showPartModal, setShowPartModal] = useState(false)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [editingSupplier, setEditingSupplier] = useState(null)
  
  const [partData, setPartData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStockLevel: '',
    unitPrice: '',
    supplier: '',
    description: '',
    partNumber: '',
    location: ''
  })

  const [supplierData, setSupplierData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    tinNumber: '',
    notes: ''
  })

  const partCategories = [
    'Engine Parts',
    'Brake System',
    'Transmission',
    'Electrical',
    'Suspension',
    'Exhaust',
    'Cooling System',
    'Fuel System',
    'Body Parts',
    'Tires & Wheels',
    'Filters',
    'Fluids',
    'Tools',
    'Other'
  ]

  useEffect(() => {
    fetchPartsInventory()
    fetchSuppliers()
  }, [])

  useEffect(() => {
    let filtered = partsInventory || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(part => 
        part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(part => part.category === categoryFilter)
    }

    // Stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(part => 
        part.inventory?.currentStock <= part.inventory?.minimumStock
      )
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(part => part.inventory?.currentStock === 0)
    }

    setFilteredParts(filtered)
  }, [partsInventory, searchTerm, categoryFilter, stockFilter])

  useEffect(() => {
    let filtered = suppliers || []

    if (searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSuppliers(filtered)
  }, [suppliers, searchTerm])

  const handleAddPart = () => {
    setEditingPart(null)
    setPartData({
      name: '',
      category: '',
      quantity: '',
      minStockLevel: '',
      unitPrice: '',
      supplier: '',
      description: '',
      partNumber: '',
      location: ''
    })
    setShowPartModal(true)
  }

  const handleEditPart = (part) => {
    setEditingPart(part)
    setPartData({
      name: part.name || '',
      category: part.category || '',
      quantity: part.inventory?.currentStock || '',
      minStockLevel: part.inventory?.minimumStock || '',
      unitPrice: part.pricing?.sellingPrice || '',
      supplier: part.supplier?._id || part.supplier || '',
      description: part.description || '',
      partNumber: part.partNumber || '',
      location: part.location || ''
    })
    setShowPartModal(true)
  }

  const submitPart = async () => {
    console.log('submitPart called with data:', partData)
    console.log('editingPart:', editingPart)
    
    try {
      let createdPart
      if (editingPart) {
        console.log('Updating existing part...')
        createdPart = await updatePart(editingPart._id, partData)
        console.log('Part updated:', createdPart)
      } else {
        console.log('Creating new part...')
        console.log('Data being sent to backend:', JSON.stringify(partData, null, 2))
        createdPart = await createPart(partData)
        console.log('Part created:', createdPart)
        
        // Create expense record for new parts
        if (partData.quantity && partData.unitPrice) {
          const totalCost = parseFloat(partData.quantity) * parseFloat(partData.unitPrice)
          
          const expenseData = {
            description: `Parts Purchase: ${partData.name}`,
            amount: totalCost,
            category: 'parts_purchase',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'cash', // Default, can be changed later
            supplier: partData.supplier ? suppliers?.find(s => s._id === partData.supplier)?.name : '',
            notes: `Auto-generated expense for parts inventory addition. Quantity: ${partData.quantity}, Unit Price: RWF ${partData.unitPrice}`
          }
          
          console.log('Creating expense record:', expenseData)
          try {
            const expenseResult = await createExpenseRecord(expenseData)
            console.log('Expense record created successfully:', expenseResult)
          } catch (expenseError) {
            console.warn('Failed to create expense record:', expenseError)
            // Don't fail the part creation if expense creation fails
          }
        }
      }
      
      console.log('Operation successful, closing modal...')
      setShowPartModal(false)
      setEditingPart(null)
      console.log('Fetching updated parts inventory...')
      await fetchPartsInventory()
    } catch (error) {
      console.error('Failed to save part:', error)
      console.error('Error details:', error.response?.data || error.message)
    }
  }

  const handleDeletePart = async (partId) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await deletePart(partId)
        fetchPartsInventory()
      } catch (error) {
        console.error('Failed to delete part:', error)
      }
    }
  }

  const handleAddSupplier = () => {
    setEditingSupplier(null)
    setSupplierData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      tinNumber: '',
      notes: ''
    })
    setShowSupplierModal(true)
  }

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier)
    setSupplierData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      tinNumber: supplier.tinNumber || '',
      notes: supplier.notes || ''
    })
    setShowSupplierModal(true)
  }

  const submitSupplier = async () => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, supplierData)
      } else {
        await createSupplier(supplierData)
      }
      setShowSupplierModal(false)
      setEditingSupplier(null)
      fetchSuppliers()
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
  }

  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(supplierId)
        fetchSuppliers()
      } catch (error) {
        console.error('Failed to delete supplier:', error)
      }
    }
  }

  const getStockStatus = (part) => {
    if (!part.inventory) return { status: 'Unknown', color: 'bg-gray-500' }
    if (part.inventory.currentStock === 0) return { status: 'Out of Stock', color: 'bg-red-500' }
    if (part.inventory.currentStock <= part.inventory.minimumStock) return { status: 'Low Stock', color: 'bg-yellow-500' }
    return { status: 'In Stock', color: 'bg-green-500' }
  }

  const totalParts = partsInventory?.length || 0
  const lowStockParts = partsInventory?.filter(part => 
    part.inventory?.currentStock <= part.inventory?.minimumStock
  )?.length || 0
  const outOfStockParts = partsInventory?.filter(part => part.inventory?.currentStock === 0)?.length || 0
  const totalValue = partsInventory?.reduce((sum, part) => 
    sum + ((part.inventory?.currentStock || 0) * (part.pricing?.sellingPrice || 0)), 0
  ) || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading inventory data...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage parts inventory and suppliers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddSupplier}>
            <Truck className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
          <Button onClick={handleAddPart}>
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Parts</p>
                <p className="text-2xl font-bold text-gray-900">{totalParts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockParts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{outOfStockParts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  RWF {totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'parts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Parts Inventory
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Suppliers
          </button>
        </nav>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={activeTab === 'parts' ? "Search parts..." : "Search suppliers..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {activeTab === 'parts' && (
              <>
                <div className="md:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Categories</option>
                    {partCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="md:w-48">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </>
            )}
            {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setStockFilter('all')
                }}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parts Tab */}
      {activeTab === 'parts' && (
        <Card>
          <CardHeader>
            <CardTitle>Parts Inventory</CardTitle>
            <CardDescription>Manage your parts inventory and stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredParts.map((part) => {
                const stockStatus = getStockStatus(part)
                return (
                  <div key={part._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${stockStatus.color} text-white`}>
                          {stockStatus.status}
                        </Badge>
                        <h3 className="font-medium">{part.name}</h3>
                        {part.partNumber && (
                          <span className="text-sm text-gray-500">#{part.partNumber}</span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <span>Category: {part.category}</span>
                        <span>Stock: {part.inventory?.currentStock || 0}</span>
                        <span>Price: RWF {part.pricing?.sellingPrice?.toLocaleString() || 0}</span>
                        <span>Value: RWF {((part.inventory?.currentStock || 0) * (part.pricing?.sellingPrice || 0))?.toLocaleString()}</span>
                      </div>
                      {part.inventory?.location?.warehouse && (
                        <div className="mt-1 text-sm text-gray-500">
                          Location: {part.inventory.location.warehouse}
                          {part.inventory.location.shelf && ` - ${part.inventory.location.shelf}`}
                        </div>
                      )}
                      {part.location && (
                        <div className="mt-1 text-sm text-gray-500">
                          Storage: {part.location}
                        </div>
                      )}
                      {part.supplier && (
                        <div className="mt-1 text-sm text-gray-500">
                          Supplier: {typeof part.supplier === 'object' ? part.supplier.name : part.supplier}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPart(part)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePart(part._id)}
                        className="text-red-600 border-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              
              {filteredParts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No parts found</h3>
                  <p>
                    {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Start by adding your first part'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Manage your supplier relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSuppliers.map((supplier) => (
                <div key={supplier._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{supplier.name}</h3>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      {supplier.contactPerson && <span>Contact: {supplier.contactPerson}</span>}
                      {supplier.email && <span>Email: {supplier.email}</span>}
                      {supplier.phone && <span>Phone: {supplier.phone}</span>}
                    </div>
                    {supplier.tinNumber && (
                      <div className="mt-1 text-sm text-gray-500">
                        TIN: {supplier.tinNumber}
                      </div>
                    )}
                    {supplier.address && (
                      <div className="mt-1 text-sm text-gray-500">
                        Address: {supplier.address}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSupplier(supplier._id)}
                      className="text-red-600 border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredSuppliers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                  <p>
                    {searchTerm
                      ? 'Try adjusting your search'
                      : 'Start by adding your first supplier'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <PartModal 
        show={showPartModal}
        editingPart={editingPart}
        partData={partData}
        setPartData={setPartData}
        onClose={() => setShowPartModal(false)}
        onSubmit={submitPart}
        partCategories={partCategories}
        suppliers={suppliers}
      />
      <SupplierModal 
        show={showSupplierModal}
        editingSupplier={editingSupplier}
        supplierData={supplierData}
        setSupplierData={setSupplierData}
        onClose={() => setShowSupplierModal(false)}
        onSubmit={submitSupplier}
      />
    </div>
  )
}

export default EnhancedInventory
