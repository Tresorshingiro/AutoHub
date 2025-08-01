import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, Key, Users, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Employees = () => {
    const { 
        employees, 
        loading, 
        error, 
        addEmployee, 
        updateEmployee, 
        deleteEmployee, 
        changeEmployeePassword,
        fetchEmployeeById 
    } = useAdmin();

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        salary: '',
        address: '',
        status: 'active',
        image: null
    });
    
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Filter employees
    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = 
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm);
        
        const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            salary: '',
            address: '',
            status: 'active',
            image: null
        });
    };

    // Handle add employee
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const result = await addEmployee(formData);
            if (result.success) {
                toast.success('Employee added successfully!');
                setShowAddModal(false);
                resetForm();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to add employee');
        }
    };

    // Handle edit employee
    const handleEditEmployee = async (e) => {
        e.preventDefault();
        try {
            const result = await updateEmployee(selectedEmployee._id, formData);
            if (result.success) {
                toast.success('Employee updated successfully!');
                setShowEditModal(false);
                resetForm();
                setSelectedEmployee(null);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update employee');
        }
    };

    // Handle delete employee
    const handleDeleteEmployee = async (employee) => {
        if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            try {
                const result = await deleteEmployee(employee._id);
                if (result.success) {
                    toast.success('Employee deleted successfully!');
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Failed to delete employee');
            }
        }
    };

    // Handle change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        try {
            const result = await changeEmployeePassword(selectedEmployee._id, {
                newPassword: passwordData.newPassword
            });
            if (result.success) {
                toast.success('Password changed successfully!');
                setShowPasswordModal(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setSelectedEmployee(null);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to change password');
        }
    };

    // Open edit modal
    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            role: employee.role,
            salary: employee.salary,
            address: employee.address,
            status: employee.status,
            image: null
        });
        setShowEditModal(true);
    };

    // Open view modal
    const openViewModal = async (employee) => {
        const fullEmployee = await fetchEmployeeById(employee._id);
        if (fullEmployee) {
            setSelectedEmployee(fullEmployee);
            setShowViewModal(true);
        }
    };

    // Open password modal
    const openPasswordModal = (employee) => {
        setSelectedEmployee(employee);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                    <p className="text-gray-600 mt-2">Manage your AutoHub team members</p>
                </div>
                
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-hero text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                        </DialogHeader>
                        <EmployeeForm 
                            formData={formData}
                            onChange={handleInputChange}
                            onSubmit={handleAddEmployee}
                            loading={loading}
                            submitText="Add Employee"
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="mechanic">Mechanic</SelectItem>
                                <SelectItem value="receptionist">Receptionist</SelectItem>
                                <SelectItem value="accountant">Accountant</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{filteredEmployees.length} employees found</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employees Grid */}
            {currentEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentEmployees.map((employee) => (
                        <Card key={employee._id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {employee.image ? (
                                            <img 
                                                src={employee.image} 
                                                alt={`${employee.firstName} ${employee.lastName}`}
                                                className="h-16 w-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <Users className="h-8 w-8 text-blue-600" />
                                        )}
                                    </div>
                                    
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {employee.firstName} {employee.lastName}
                                    </h3>
                                    
                                    <Badge 
                                        variant="secondary" 
                                        className="mb-2 capitalize"
                                    >
                                        {employee.role}
                                    </Badge>
                                    
                                    <p className="text-sm text-gray-600 mb-2">{employee.email}</p>
                                    <p className="text-sm text-gray-600 mb-4">{employee.phone}</p>
                                    
                                    <div className="mb-4">
                                        <Badge 
                                            variant={employee.status === 'active' ? 'default' : 'secondary'}
                                            className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                        >
                                            {employee.status}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-center space-x-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => openViewModal(employee)}
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => openEditModal(employee)}
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => openPasswordModal(employee)}
                                        >
                                            <Key className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleDeleteEmployee(employee)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-gradient-hero text-white" : ""}
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="text-gray-400">...</span>;
                        }
                        return null;
                    })}
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    <EmployeeForm 
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleEditEmployee}
                        loading={loading}
                        submitText="Update Employee"
                    />
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <EmployeeView employee={selectedEmployee} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Password Change Modal */}
            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowPasswordModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-gradient-hero text-white"
                                disabled={loading}
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Employee Form Component
const EmployeeForm = ({ formData, onChange, onSubmit, loading, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={onChange}
                required
            />
            <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={onChange}
                required
            />
        </div>
        
        <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
        />
        
        <Input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={onChange}
            required
        />
        
        <div className="grid grid-cols-2 gap-4">
            <Select 
                value={formData.role} 
                onValueChange={(value) => onChange({ target: { name: 'role', value } })}
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                </SelectContent>
            </Select>
            
            <Input
                name="salary"
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={onChange}
                required
            />
        </div>
        
        <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={onChange}
        />
        
        <Select 
            value={formData.status} 
            onValueChange={(value) => onChange({ target: { name: 'status', value } })}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
        </Select>
        
        <Input
            name="image"
            type="file"
            accept="image/*"
            onChange={onChange}
        />
        
        <div className="flex justify-end space-x-2">
            <Button type="submit" className="bg-gradient-hero text-white" disabled={loading}>
                {loading ? 'Saving...' : submitText}
            </Button>
        </div>
    </form>
);

// Employee View Component
const EmployeeView = ({ employee }) => (
    <div className="space-y-4">
        <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                {employee.image ? (
                    <img 
                        src={employee.image} 
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="h-20 w-20 rounded-full object-cover"
                    />
                ) : (
                    <Users className="h-10 w-10 text-blue-600" />
                )}
            </div>
            <div>
                <h3 className="text-xl font-semibold">{employee.firstName} {employee.lastName}</h3>
                <Badge className="capitalize">{employee.role}</Badge>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{employee.email}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{employee.phone}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-600">Salary</label>
                <p className="text-gray-900">${employee.salary?.toLocaleString()}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <Badge 
                    className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                    {employee.status}
                </Badge>
            </div>
            <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{employee.address || 'Not provided'}</p>
            </div>
            <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Joined Date</label>
                <p className="text-gray-900">{new Date(employee.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    </div>
);

export default Employees;
