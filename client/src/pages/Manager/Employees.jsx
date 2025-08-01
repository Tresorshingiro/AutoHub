import React, { useState, useEffect } from 'react'
import { useManager } from '../../context/ManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { 
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  AlertCircle
} from 'lucide-react'

const ManagerEmployees = () => {
  const { 
    employees, 
    loading, 
    fetchEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useManager()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    role: '',
    salary: '',
    status: 'active',
    password: '',
    image: null
  })

  useEffect(() => {
    console.log('ManagerEmployees: Component mounted, fetching employees...')
    fetchEmployees()
  }, [])

  useEffect(() => {
    console.log('ManagerEmployees: Employees state updated:', employees)
  }, [employees])

  // Filter employees based on search and filters
  const filteredEmployees = (employees || []).filter(employee => {
    const matchesSearch = 
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber?.includes(searchTerm)

    const matchesRole = filterRole === 'all' || employee.role === filterRole
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key])
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key])
        }
      })

      await addEmployee(formDataToSend)
      setShowAddModal(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        gender: '',
        role: '',
        salary: '',
        status: 'active',
        password: '',
        image: null
      })
      setImagePreview(null)
      fetchEmployees()
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  const handleEditEmployee = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key])
        } else if (key !== 'image' && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      await updateEmployee(selectedEmployee._id, formDataToSend)
      setShowEditModal(false)
      setSelectedEmployee(null)
      setImagePreview(null)
      setIsUpdatingPassword(false)
      fetchEmployees()
    } catch (error) {
      console.error('Error updating employee:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({...formData, image: file})
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(selectedEmployee._id)
      setShowDeleteModal(false)
      setSelectedEmployee(null)
      fetchEmployees()
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }

  const openEditModal = (employee) => {
    setSelectedEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      gender: employee.gender,
      role: employee.role,
      salary: employee.salary,
      status: employee.status,
      password: '', // Don't pre-fill password
      image: null // Don't pre-fill image file
    })
    setImagePreview(employee.image || null) // Set existing image as preview
    setIsUpdatingPassword(false)
    setShowEditModal(true)
  }

  const openViewModal = (employee) => {
    setSelectedEmployee(employee)
    setShowViewModal(true)
  }

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee)
    setShowDeleteModal(true)
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-purple-100 text-purple-800'
      case 'accountant': return 'bg-blue-100 text-blue-800'
      case 'mechanic': return 'bg-green-100 text-green-800'
      case 'receptionist': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-2">Manage your workforce and employee information</p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 whitespace-nowrap"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{employees.length || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {employees.filter(emp => emp.status === 'active').length || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mechanics</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {employees.filter(emp => emp.role === 'mechanic').length || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                    <p className="text-2xl font-bold text-green-600">
                      {employees.reduce((total, emp) => total + (emp.salary || 0), 0).toLocaleString() || 0} RWF
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-auto lg:flex lg:space-x-4">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="mechanic">Mechanic</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>
                {filteredEmployees.length} of {employees?.length || 0} employees
                {employees?.length === 0 && !loading && " - No employees found in database"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {employees?.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first employee to the system.</p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium text-gray-600">Employee</th>
                          <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                          <th className="text-left p-4 font-medium text-gray-600">Role</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Salary</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map((employee) => (
                          <tr key={employee._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <img src={employee.image} alt={employee.firstName} className='w-10 h-10 rounded-full' />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {employee.firstName} {employee.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {employee.phoneNumber}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {employee.address}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getRoleBadgeColor(employee.role)}>
                                {employee.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusBadgeColor(employee.status)}>
                                {employee.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-gray-900">
                                {employee.salary?.toLocaleString()} RWF
                              </p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openViewModal(employee)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditModal(employee)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openDeleteModal(employee)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredEmployees.length === 0 && employees?.length > 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No employees found matching your search criteria</p>
                      <Button 
                        onClick={() => {
                          setSearchTerm('')
                          setFilterRole('all')
                          setFilterStatus('all')
                        }}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>      {/* Add Employee Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the employee information below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary (RWF)
              </label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter employee password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t mt-6 sticky bottom-0 bg-white">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
                Add Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEmployee} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary (RWF)
              </label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}
                >
                  {isUpdatingPassword ? 'Cancel Password Update' : 'Update Password'}
                </Button>
              </div>
              {isUpdatingPassword && (
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter new password"
                  required={isUpdatingPassword}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                )}
                {!imagePreview && selectedEmployee?.image && (
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <img 
                        src={selectedEmployee.image} 
                        alt="Current" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t mt-6 sticky bottom-0 bg-white">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
                Update Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Employee Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {selectedEmployee.image ? (
                    <img 
                      src={selectedEmployee.image} 
                      alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <Users className="h-10 w-10 text-blue-600" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <Badge className={getRoleBadgeColor(selectedEmployee.role)}>
                  {selectedEmployee.role}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.salary?.toLocaleString()} RWF</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <Badge className={getStatusBadgeColor(selectedEmployee.status)}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                  <p className="text-sm text-red-700">{selectedEmployee.email}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEmployee}
            >
              Delete Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  )
}

export default ManagerEmployees
