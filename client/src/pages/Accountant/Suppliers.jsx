import React, { useEffect, useState } from 'react'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { 
  Plus, 
  Search, 
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  Edit,
  Trash2,
  X,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Supplier Modal - moved outside component to prevent re-rendering
const SupplierModal = ({ show, editingSupplier, supplierData, setSupplierData, onClose, onSubmit }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h3>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name *</label>
            <Input
              value={supplierData.name}
              onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Person *</label>
            <Input
              value={supplierData.contactPerson}
              onChange={(e) => setSupplierData({...supplierData, contactPerson: e.target.value})}
              placeholder="Enter contact person name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={supplierData.email}
              onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone *</label>
            <Input
              type="tel"
              value={supplierData.phone}
              onChange={(e) => setSupplierData({...supplierData, phone: e.target.value})}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <Input
              value={supplierData.address}
              onChange={(e) => setSupplierData({...supplierData, address: e.target.value})}
              placeholder="Enter address"
              required
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
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              type="url"
              value={supplierData.website}
              onChange={(e) => setSupplierData({...supplierData, website: e.target.value})}
              placeholder="Enter website URL (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={supplierData.status}
              onChange={(e) => setSupplierData({...supplierData, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!supplierData.name || !supplierData.email || !supplierData.phone || !supplierData.contactPerson || !supplierData.address}
          >
            {editingSupplier ? 'Update' : 'Add'} Supplier
          </Button>
        </div>
      </div>
    </div>
  )
}

const Suppliers = () => {
  const { 
    suppliers, 
    loading, 
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  } = useAccountant()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [supplierData, setSupplierData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    website: '',
    tinNumber: '',
    status: 'active'
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    let filtered = suppliers || []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter)
    }

    setFilteredSuppliers(filtered)
  }, [suppliers, searchTerm, statusFilter])

  const handleAddSupplier = () => {
    setEditingSupplier(null)
    setSupplierData({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      website: '',
      tinNumber: '',
      status: 'active'
    })
    setShowSupplierModal(true)
  }

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier)
    setSupplierData({
      name: supplier.name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      contactPerson: supplier.contactPerson || '',
      website: supplier.website || '',
      tinNumber: supplier.tinNumber || '',
      status: supplier.status || 'active'
    })
    setShowSupplierModal(true)
  }

  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(supplierId)
        // Refresh the suppliers list
        await fetchSuppliers()
      } catch (error) {
        console.error('Failed to delete supplier:', error)
      }
    }
  }

  const submitSupplier = async () => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, supplierData)
      } else {
        await createSupplier(supplierData)
      }
      setShowSupplierModal(false)
      setSupplierData({
        name: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        website: '',
        tinNumber: '',
        status: 'active'
      })
      // Refresh the suppliers list
      await fetchSuppliers()
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const activeSuppliers = suppliers?.filter(s => s.status === 'active')?.length || 0
  const inactiveSuppliers = suppliers?.filter(s => s.status === 'inactive')?.length || 0
  const totalSuppliers = suppliers?.length || 0

  if (loading && !suppliers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading suppliers...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier network and contacts</p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold">{totalSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{activeSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">{inactiveSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Partnership Rate</p>
                <p className="text-2xl font-bold">
                  {totalSuppliers > 0 ? Math.round((activeSuppliers / totalSuppliers) * 100) : 0}%
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
                  placeholder="Search by name, contact person, email, or phone..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                <Badge className={`${getStatusColor(supplier.status)} text-white`}>
                  {supplier.status}
                </Badge>
              </div>
              <CardDescription>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {supplier.contactPerson}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{supplier.address}</span>
                </div>
                {supplier.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <a 
                      href={supplier.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 truncate"
                    >
                      {supplier.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-3 flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleEditSupplier(supplier)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDeleteSupplier(supplier._id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No suppliers message */}
      {filteredSuppliers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first supplier'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={handleAddSupplier} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Supplier
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Supplier Modal */}
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

export default Suppliers
