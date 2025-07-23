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

export const AccountantProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
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
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  })

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

    // Supplier management
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,

    // Inventory management
    fetchInventory,
    updatePartStock,
    fetchLowStockParts,

    // Parts inventory management
    fetchPartsInventory,
    addPart,
    updatePartInventory,

    // Income management
    fetchIncomeRecords,

    // Expense management
    fetchExpenseRecords,
    addExpense,

    // Reports
    generateMonthlyReport,
    generateOverallReport
  }

  return (
    <AccountantContext.Provider value={value}>
      {children}
    </AccountantContext.Provider>
  )
}

export default AccountantContext
