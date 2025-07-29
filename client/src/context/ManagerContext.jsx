import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

const ManagerContext = createContext()

export const useManager = () => {
  const context = useContext(ManagerContext)
  if (!context) {
    throw new Error('useManager must be used within a ManagerProvider')
  }
  return context
}

// Custom hook to use AuthContext
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}

export const ManagerProvider = ({ children }) => {
  const { user } = useAuth()
  
  // All hooks must be called at the top level, before any conditional returns
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [operationsData, setOperationsData] = useState(null)
  const [reportsData, setReportsData] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // Get auth headers
  const getAuthHeaders = () => {
    let token = user?.token
    
    // Fallback: get token from localStorage if not in user object
    if (!token && user?.role === 'manager') {
      token = localStorage.getItem('managerToken') // This matches AuthContext ${role}Token pattern
    }
    
    // Additional fallbacks for manager authentication
    if (!token) {
      token = localStorage.getItem('managertoken') || localStorage.getItem('token')
    }
    
    console.log('ManagerContext: Auth details:', {
      userRole: user?.role,
      userToken: user?.token ? 'exists' : 'missing',
      storageToken: token ? 'exists' : 'missing',
      finalToken: token ? token.substring(0, 20) + '...' : 'none'
    })
    
    return {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  }

  // Dashboard Functions
  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/manager/dashboard`, getAuthHeaders())
      if (data.success) {
        setDashboard(data.dashboard)
      }
    } catch (error) {
      console.error('Manager Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Manager Profile Functions
  const fetchManagerProfile = async () => {
    try {
      console.log('ManagerContext: Fetching manager profile...')
      const { data } = await axios.get(`${backendUrl}/api/manager/profile`, getAuthHeaders())
      console.log('ManagerContext: Profile response:', data)
      
      if (data.success && data.employee) {
        // Update the user context with complete profile data
        const updatedUser = {
          ...user,
          firstName: data.employee.firstName,
          lastName: data.employee.lastName,
          email: data.employee.email,
          phoneNumber: data.employee.phoneNumber,
          address: data.employee.address,
          gender: data.employee.gender,
          image: data.employee.image,
          role: data.employee.role
        }
        
        // Update localStorage and user state
        localStorage.setItem('userData', JSON.stringify(updatedUser))
        
        // You would typically use a context method to update user, but for now let's log it
        console.log('ManagerContext: Updated user profile:', updatedUser)
        
        return data.employee
      }
    } catch (error) {
      console.error('Manager profile fetch error:', error)
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.')
      } else {
        toast.error('Failed to load profile data')
      }
    }
  }

  // Operations Monitoring Functions
  const fetchOperationsData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/manager/operations`, getAuthHeaders())
      if (data.success) {
        setOperationsData(data.operations)
      }
    } catch (error) {
      console.error('Operations data fetch error:', error)
      toast.error('Failed to load operations data')
    } finally {
      setLoading(false)
    }
  }

  // Employee Management Functions
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      console.log('ManagerContext: Fetching employees...', {
        url: `${backendUrl}/api/manager/employees`,
        headers: getAuthHeaders(),
        user: user
      })
      
      const { data } = await axios.get(`${backendUrl}/api/manager/employees`, getAuthHeaders())
      console.log('ManagerContext: Employees response:', data)
      
      if (data.success) {
        setEmployees(data.employees || [])
        console.log('ManagerContext: Employees set:', data.employees)
        return data.employees
      } else {
        console.error('ManagerContext: Fetch employees failed:', data.message)
        toast.error(data.message || 'Failed to load employees')
      }
    } catch (error) {
      console.error('Employees fetch error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error headers:', error.response?.headers)
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.')
      } else if (error.response?.status === 403) {
        toast.error('Access forbidden. Manager role required.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load employees')
      }
    } finally {
      setLoading(false)
    }
  }

  const addEmployee = async (employeeData) => {
    try {
      setLoading(true)
      console.log('ManagerContext: Adding employee...', employeeData)
      
      // Determine content type based on whether it's FormData or regular object
      const isFormData = employeeData instanceof FormData
      const headers = getAuthHeaders()
      
      if (isFormData) {
        // Remove Content-Type for FormData to let browser set boundary
        delete headers.headers['Content-Type']
      }
      
      const { data } = await axios.post(
        `${backendUrl}/api/manager/employees`,
        employeeData,
        headers
      )
      if (data.success) {
        toast.success(data.message)
        await fetchEmployees() // Refresh employees list
        return data.employee
      }
    } catch (error) {
      console.error('Employee creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to add employee')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateEmployee = async (employeeId, updateData) => {
    try {
      setLoading(true)
      console.log('ManagerContext: Updating employee...', employeeId, updateData)
      
      // Determine content type based on whether it's FormData or regular object
      const isFormData = updateData instanceof FormData
      const headers = getAuthHeaders()
      
      if (isFormData) {
        // Remove Content-Type for FormData to let browser set boundary
        delete headers.headers['Content-Type']
      }
      
      const { data } = await axios.patch(
        `${backendUrl}/api/manager/employees/${employeeId}`,
        updateData,
        headers
      )
      if (data.success) {
        toast.success(data.message)
        await fetchEmployees() // Refresh employees list
        return data.employee
      }
    } catch (error) {
      console.error('Employee update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update employee')
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async (employeeId) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(
        `${backendUrl}/api/manager/employees/${employeeId}`,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchEmployees() // Refresh employees list
        return true
      }
    } catch (error) {
      console.error('Employee deletion error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete employee')
    } finally {
      setLoading(false)
    }
  }

  // Payroll Management Functions
  const fetchPayrolls = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/manager/payrolls?${params}`, getAuthHeaders())
      if (data.success) {
        setPayrolls(data.payrolls)
        return data.payrolls
      }
    } catch (error) {
      console.error('Payrolls fetch error:', error)
      toast.error('Failed to load payrolls')
    } finally {
      setLoading(false)
    }
  }

  const generatePayroll = async (payrollData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/manager/payrolls`,
        payrollData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchPayrolls() // Refresh payrolls list
        await fetchDashboard() // Refresh dashboard (expense added)
        return data.payroll
      }
    } catch (error) {
      console.error('Payroll generation error:', error)
      toast.error(error.response?.data?.message || 'Failed to generate payroll')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const downloadPayrollCSV = async (year, month) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${backendUrl}/api/manager/payrolls/${year}/${month}/download`,
        {
          ...getAuthHeaders(),
          responseType: 'blob'
        }
      )
      
      // Create blob and download file
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payroll-${month}-${year}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Payroll CSV downloaded successfully')
    } catch (error) {
      console.error('Download payroll CSV error:', error)
      toast.error(error.response?.data?.message || 'Failed to download payroll CSV')
    } finally {
      setLoading(false)
    }
  }

  const updatePayrollStatus = async (payrollId, status) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/manager/payrolls/${payrollId}/status`,
        { status },
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchPayrolls() // Refresh payrolls list
        return data.payroll
      }
    } catch (error) {
      console.error('Payroll status update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update payroll status')
    } finally {
      setLoading(false)
    }
  }

  const deletePayroll = async (payrollId) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(
        `${backendUrl}/api/manager/payrolls/${payrollId}`,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchPayrolls() // Refresh payrolls list
        return true
      }
    } catch (error) {
      console.error('Payroll deletion error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete payroll')
    } finally {
      setLoading(false)
    }
  }

  // Supplier Management Functions
  const fetchSuppliersWithParts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/manager/suppliers-with-parts`, getAuthHeaders())
      if (data.success) {
        setSuppliers(data.suppliers)
        return data.suppliers
      }
    } catch (error) {
      console.error('Suppliers with parts fetch error:', error)
      toast.error('Failed to load suppliers and parts data')
    } finally {
      setLoading(false)
    }
  }

  // Reports Functions
  const generateManagerReports = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        reportType: filters.type || 'financial',
        dateRange: filters.dateRange || 'month',
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      }).toString()
      const { data } = await axios.get(`${backendUrl}/api/manager/reports?${params}`, getAuthHeaders())
      if (data.success) {
        setReportsData(data.reports)
        return data.reports
      }
    } catch (error) {
      console.error('Manager reports generation error:', error)
      toast.error('Failed to generate reports')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchFinancialSummary = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/manager/reports?reportType=financial`, getAuthHeaders())
      if (data.success) {
        return data.reports.financial
      }
    } catch (error) {
      console.error('Financial summary fetch error:', error)
      return null
    }
  }

  const fetchInventoryReport = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/manager/reports?reportType=inventory`, getAuthHeaders())
      if (data.success) {
        return data.reports.inventory
      }
    } catch (error) {
      console.error('Inventory report fetch error:', error)
      return null
    }
  }

  const generatePayrollReport = async (year, month) => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${backendUrl}/api/manager/reports/payroll?year=${year}&month=${month}`,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Payroll report generated successfully')
        return data.report
      }
    } catch (error) {
      console.error('Payroll report generation error:', error)
      toast.error('Failed to generate payroll report')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Load initial data when user changes
  useEffect(() => {
    if (user?.role === 'manager' && user?.token) {
      fetchManagerProfile() // Fetch profile first
      fetchDashboard()
      fetchEmployees()
      fetchPayrolls()
      fetchSuppliersWithParts()
      fetchOperationsData()
    }
  }, [user])

  const value = {
    // State
    loading,
    dashboard,
    employees,
    payrolls,
    suppliers,
    operationsData,
    reportsData,

    // Dashboard
    fetchDashboard,
    fetchManagerProfile,

    // Operations
    fetchOperationsData,

    // Employee management
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Payroll management
    fetchPayrolls,
    generatePayroll,
    downloadPayrollCSV,
    updatePayrollStatus,
    deletePayroll,

    // Supplier management
    fetchSuppliersWithParts,

    // Reports
    generateManagerReports,
    generatePayrollReport,
    fetchFinancialSummary,
    fetchInventoryReport
  }

  return (
    <ManagerContext.Provider value={value}>
      {!user ? (
        <div className="p-6">Please log in to access manager features.</div>
      ) : user.role !== 'manager' ? (
        <div className="p-6">Access denied. Manager role required.</div>
      ) : (
        children
      )}
    </ManagerContext.Provider>
  )
}

export default ManagerContext
