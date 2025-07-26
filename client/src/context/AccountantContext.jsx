import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

const AccountantContext = createContext()

export const useAccountant = () => {
  const context = useContext(AccountantContext)
  if (!context) {
    throw new Error('useAccountant must be used within an AccountantProvider')
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

export const AccountantProvider = ({ children }) => {
  const { user } = useAuth()
  
  // All hooks must be called at the top level, before any conditional returns
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [clearedVehicles, setClearedVehicles] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [parts, setParts] = useState([])
  const [partsInventory, setPartsInventory] = useState([])
  const [incomeRecords, setIncomeRecords] = useState([])
  const [expenseRecords, setExpenseRecords] = useState([])

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // Get auth headers
  const getAuthHeaders = () => {
    let token = user?.token
    
    // Fallback: get token from localStorage if not in user object
    if (!token && user?.role === 'accountant') {
      token = localStorage.getItem('accountantToken')
    }
    
    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  }

  // Dashboard Functions
  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/accountant/dashboard`, getAuthHeaders())
      if (data.success) {
        setDashboard(data.dashboard)
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Payment Management Functions
  const fetchClearedVehicles = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/vehicles/cleared?${params}`, getAuthHeaders())
      if (data.success) {
        setClearedVehicles(data.vehicles)
        return data.vehicles
      }
    } catch (error) {
      console.error('Cleared vehicles fetch error:', error)
      toast.error('Failed to load cleared vehicles')
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (vehicleId, paymentData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/accountant/vehicles/${vehicleId}/payment`,
        paymentData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchClearedVehicles() // Refresh cleared vehicles
        await fetchDashboard() // Refresh dashboard
        return data.vehicle
      }
    } catch (error) {
      console.error('Payment status update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update payment status')
    } finally {
      setLoading(false)
    }
  }

  // Record payment function for ClearedVehicles component
  const recordPayment = async (vehicleId, paymentData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/accountant/vehicles/${vehicleId}/payment`,
        paymentData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Payment recorded successfully')
        await fetchClearedVehicles() // Refresh cleared vehicles
        await fetchDashboard() // Refresh dashboard
        return data.vehicle
      }
    } catch (error) {
      console.error('Record payment error:', error)
      toast.error(error.response?.data?.message || 'Failed to record payment')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Create invoice function for ClearedVehicles component
  const createInvoice = async (vehicleId, invoiceData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/accountant/vehicles/${vehicleId}/invoice`,
        invoiceData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Invoice created successfully')
        await fetchClearedVehicles() // Refresh cleared vehicles
        return data.invoice
      }
    } catch (error) {
      console.error('Create invoice error:', error)
      toast.error(error.response?.data?.message || 'Failed to create invoice')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Supplier Management Functions
  const fetchSuppliers = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/suppliers?${params}`, getAuthHeaders())
      if (data.success) {
        setSuppliers(data.suppliers)
        return data.suppliers
      }
    } catch (error) {
      console.error('Suppliers fetch error:', error)
      toast.error('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  const addSupplier = async (supplierData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/accountant/suppliers`,
        supplierData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchSuppliers() // Refresh suppliers
        return data.supplier
      }
    } catch (error) {
      console.error('Supplier creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to add supplier')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSupplier = async (supplierId, updateData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/accountant/suppliers/${supplierId}`,
        updateData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchSuppliers() // Refresh suppliers
        return data.supplier
      }
    } catch (error) {
      console.error('Supplier update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update supplier')
    } finally {
      setLoading(false)
    }
  }

  const deleteSupplier = async (supplierId) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(
        `${backendUrl}/api/accountant/suppliers/${supplierId}`,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchSuppliers() // Refresh suppliers
        return true
      }
    } catch (error) {
      console.error('Supplier deletion error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete supplier')
    } finally {
      setLoading(false)
    }
  }

  // Inventory Management Functions
  const fetchInventory = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/parts?${params}`, getAuthHeaders())
      if (data.success) {
        setParts(data.parts)
        return data.parts
      }
    } catch (error) {
      console.error('Inventory fetch error:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const updatePartStock = async (partId, stockData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/accountant/parts/${partId}/stock`,
        stockData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchInventory() // Refresh inventory
        return data.part
      }
    } catch (error) {
      console.error('Stock update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update stock')
    } finally {
      setLoading(false)
    }
  }

  const fetchLowStockParts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/accountant/parts/low-stock`, getAuthHeaders())
      if (data.success) {
        toast.info(`Found ${data.parts.length} parts with low stock`)
        return data.parts
      }
    } catch (error) {
      console.error('Low stock fetch error:', error)
      toast.error('Failed to load low stock parts')
      return []
    }
  }

  // Parts Inventory Management Functions
  const fetchPartsInventory = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/parts/inventory?${params}`, getAuthHeaders())
      if (data.success) {
        setPartsInventory(data.parts)
        return data.parts
      }
    } catch (error) {
      console.error('Parts inventory fetch error:', error)
      toast.error('Failed to load parts inventory')
    } finally {
      setLoading(false)
    }
  }

  const addPart = async (partData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/accountant/parts`,
        partData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchPartsInventory() // Refresh parts inventory
        return data.part
      }
    } catch (error) {
      console.error('Part creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to add part')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePartInventory = async (partId, inventoryData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/accountant/parts/${partId}/inventory`,
        inventoryData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchPartsInventory() // Refresh parts inventory
        await fetchDashboard() // Refresh dashboard
        return data.part
      }
    } catch (error) {
      console.error('Part inventory update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update part inventory')
    } finally {
      setLoading(false)
    }
  }

  // Income Management Functions
  const fetchIncomeRecords = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/income?${params}`, getAuthHeaders())
      if (data.success) {
        setIncomeRecords(data.incomes)
        return data.incomes
      }
    } catch (error) {
      console.error('Income records fetch error:', error)
      toast.error('Failed to load income records')
    } finally {
      setLoading(false)
    }
  }

  const createIncomeRecord = async (incomeData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/accountant/income`, incomeData, getAuthHeaders())
      if (data.success) {
        toast.success('Income record created successfully')
        return data.income
      }
    } catch (error) {
      console.error('Income creation error:', error)
      toast.error('Failed to create income record')
      throw error
    }
  }

  const updateIncomeRecord = async (incomeId, incomeData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/accountant/income/${incomeId}`, incomeData, getAuthHeaders())
      if (data.success) {
        toast.success('Income record updated successfully')
        return data.income
      }
    } catch (error) {
      console.error('Income update error:', error)
      toast.error('Failed to update income record')
      throw error
    }
  }

  const deleteIncomeRecord = async (incomeId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/accountant/income/${incomeId}`, getAuthHeaders())
      if (data.success) {
        toast.success('Income record deleted successfully')
      }
    } catch (error) {
      console.error('Income deletion error:', error)
      toast.error('Failed to delete income record')
      throw error
    }
  }

  // Expense Management Functions
  const fetchExpenseRecords = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/accountant/expenses?${params}`, getAuthHeaders())
      if (data.success) {
        setExpenseRecords(data.expenses)
        return data.expenses
      }
    } catch (error) {
      console.error('Expense records fetch error:', error)
      toast.error('Failed to load expense records')
    } finally {
      setLoading(false)
    }
  }

  const createExpenseRecord = async (expenseData) => {
    try {
      console.log('AccountantContext: Creating expense with data:', expenseData)
      console.log('Backend URL:', backendUrl)
      console.log('Auth headers:', getAuthHeaders())
      
      const { data } = await axios.post(`${backendUrl}/api/accountant/expenses`, expenseData, getAuthHeaders())
      console.log('Backend response:', data)
      
      if (data.success) {
        toast.success('Expense record created successfully')
        return data.expense
      } else {
        throw new Error(data.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Expense creation error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error('Failed to create expense record')
      throw error
    }
  }

  const updateExpenseRecord = async (expenseId, expenseData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/accountant/expenses/${expenseId}`, expenseData, getAuthHeaders())
      if (data.success) {
        toast.success('Expense record updated successfully')
        return data.expense
      }
    } catch (error) {
      console.error('Expense update error:', error)
      toast.error('Failed to update expense record')
      throw error
    }
  }

  const deleteExpenseRecord = async (expenseId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/accountant/expenses/${expenseId}`, getAuthHeaders())
      if (data.success) {
        toast.success('Expense record deleted successfully')
      }
    } catch (error) {
      console.error('Expense deletion error:', error)
      toast.error('Failed to delete expense record')
      throw error
    }
  }

  // Enhanced Parts Management Functions
  const fetchParts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/accountant/parts`, getAuthHeaders())
      if (data.success) {
        setParts(data.parts)
      }
    } catch (error) {
      console.error('Parts fetch error:', error)
      toast.error('Failed to load parts')
    } finally {
      setLoading(false)
    }
  }

  const createPart = async (partData) => {
    try {
      console.log('AccountantContext: Creating part with data:', partData)
      console.log('Backend URL:', backendUrl)
      console.log('Auth headers:', getAuthHeaders())
      
      const { data } = await axios.post(`${backendUrl}/api/accountant/parts`, partData, getAuthHeaders())
      console.log('Backend response:', data)
      
      if (data.success) {
        toast.success('Part created successfully')
        return data.part
      } else {
        throw new Error(data.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Part creation error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error('Failed to create part')
      throw error
    }
  }

  const updatePart = async (partId, partData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/accountant/parts/${partId}`, partData, getAuthHeaders())
      if (data.success) {
        toast.success('Part updated successfully')
        return data.part
      }
    } catch (error) {
      console.error('Part update error:', error)
      toast.error('Failed to update part')
      throw error
    }
  }

  const deletePart = async (partId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/accountant/parts/${partId}`, getAuthHeaders())
      if (data.success) {
        toast.success('Part deleted successfully')
      }
    } catch (error) {
      console.error('Part deletion error:', error)
      toast.error('Failed to delete part')
      throw error
    }
  }

  // Enhanced Supplier Management Functions
  const createSupplier = async (supplierData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/accountant/suppliers`, supplierData, getAuthHeaders())
      if (data.success) {
        toast.success('Supplier created successfully')
        return data.supplier
      }
    } catch (error) {
      console.error('Supplier creation error:', error)
      toast.error('Failed to create supplier')
      throw error
    }
  }

  const addExpense = async (expenseData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/accountant/expenses`,
        expenseData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchExpenseRecords() // Refresh expense records
        await fetchDashboard() // Refresh dashboard
        return data.expense
      }
    } catch (error) {
      console.error('Expense creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to add expense')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reports Functions
  const generateMonthlyReport = async (year, month) => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${backendUrl}/api/accountant/reports/monthly?year=${year}&month=${month}`,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Monthly report generated successfully')
        return data.report
      }
    } catch (error) {
      console.error('Monthly report generation error:', error)
      toast.error('Failed to generate monthly report')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const generateOverallReport = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/accountant/reports/overall`, getAuthHeaders())
      if (data.success) {
        toast.success('Overall report generated successfully')
        return data.report
      }
    } catch (error) {
      console.error('Overall report generation error:', error)
      toast.error('Failed to generate overall report')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Load initial data when user changes
  useEffect(() => {
    if (user?.role === 'accountant' && user?.token) {
      fetchDashboard()
      fetchClearedVehicles()
      fetchSuppliers()
      fetchInventory()
      fetchPartsInventory()
      fetchIncomeRecords()
      fetchExpenseRecords()
    }
  }, [user])

  const value = {
    // State
    loading,
    dashboard,
    clearedVehicles,
    suppliers,
    parts,
    partsInventory,
    incomeRecords,
    expenseRecords,

    // Dashboard
    fetchDashboard,

    // Payment management
    fetchClearedVehicles,
    updatePaymentStatus,
    recordPayment,
    createInvoice,

    // Supplier management
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    createSupplier,

    // Inventory management
    fetchInventory,
    updatePartStock,
    fetchLowStockParts,

    // Parts inventory management
    fetchPartsInventory,
    addPart,
    updatePartInventory,
    fetchParts,
    createPart,
    updatePart,
    deletePart,

    // Income management
    fetchIncomeRecords,
    createIncomeRecord,
    updateIncomeRecord,
    deleteIncomeRecord,

    // Expense management
    fetchExpenseRecords,
    addExpense,
    createExpenseRecord,
    updateExpenseRecord,
    deleteExpenseRecord,

    // Reports
    generateMonthlyReport,
    generateOverallReport
  }

  return (
    <AccountantContext.Provider value={value}>
      {!user ? (
        <div className="p-6">Please log in to access accountant features.</div>
      ) : user.role !== 'accountant' ? (
        <div className="p-6">Access denied. Accountant role required.</div>
      ) : (
        children
      )}
    </AccountantContext.Provider>
  )
}

export default AccountantContext
