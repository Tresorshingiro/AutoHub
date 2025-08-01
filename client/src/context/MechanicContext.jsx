import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

const MechanicContext = createContext()

export const useMechanic = () => {
  const context = useContext(MechanicContext)
  if (!context) {
    throw new Error('useMechanic must be used within a MechanicProvider')
  }
  return context
}

export const MechanicProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [quotations, setQuotations] = useState([])
  const [services, setServices] = useState([])
  const [parts, setParts] = useState([])
  const [lowStockParts, setLowStockParts] = useState([])

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // Get auth headers
  const getAuthHeaders = () => {
    return {
      headers: { mtoken: user?.token }
    }
  }

  // Dashboard Functions
  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/mechanic/dashboard`, getAuthHeaders())
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

  // Vehicle Functions
  const fetchAssignedVehicles = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/mechanic/vehicles`, getAuthHeaders())
      if (data.success) {
        setVehicles(data.vehicles)
        return data.vehicles
      }
    } catch (error) {
      console.error('Vehicles fetch error:', error)
      console.error('Error response:', error.response?.data)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const updateVehicleStatus = async (vehicleId, status, notes = '') => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/mechanic/vehicles/${vehicleId}/status`,
        { status, notes },
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchAssignedVehicles() // Refresh vehicles
        return data.vehicle
      }
    } catch (error) {
      console.error('Vehicle status update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update vehicle status')
    } finally {
      setLoading(false)
    }
  }

  // Parts Functions
  const fetchAllParts = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${backendUrl}/api/mechanic/parts?${params}`, getAuthHeaders())
      if (data.success) {
        setParts(data.parts)
        return data.parts
      }
    } catch (error) {
      console.error('Parts fetch error:', error)
      toast.error('Failed to load parts')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompatibleParts = async (vehicleId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(
        `${backendUrl}/api/mechanic/parts/compatible/${vehicleId}?${params}`,
        getAuthHeaders()
      )
      if (data.success) {
        return data.parts
      }
    } catch (error) {
      console.error('Compatible parts fetch error:', error)
      toast.error('Failed to load compatible parts')
      return []
    }
  }

  const fetchLowStockParts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/mechanic/parts/low-stock`, getAuthHeaders())
      if (data.success) {
        setLowStockParts(data.parts)
        return data.parts
      }
    } catch (error) {
      console.error('Low stock parts fetch error:', error)
      toast.error('Failed to load low stock parts')
    }
  }

  // Quotation Functions
  const fetchQuotations = async (status = '') => {
    try {
      setLoading(true)
      const params = status ? `?status=${status}` : ''
      const { data } = await axios.get(`${backendUrl}/api/mechanic/quotations${params}`, getAuthHeaders())
      if (data.success) {
        setQuotations(data.quotations)
        return data.quotations
      }
    } catch (error) {
      console.error('Quotations fetch error:', error)
      toast.error('Failed to load quotations')
    } finally {
      setLoading(false)
    }
  }

  const createQuotation = async (vehicleId, quotationData) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/mechanic/quotations/${vehicleId}`,
        quotationData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Quotation created successfully')
        await fetchQuotations() // Refresh quotations
        return data.quotation
      }
    } catch (error) {
      console.error('Quotation creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to create quotation')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuotation = async (quotationId, updateData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/mechanic/quotations/${quotationId}`,
        updateData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Quotation updated successfully')
        await fetchQuotations() // Refresh quotations
        return data.quotation
      }
    } catch (error) {
      console.error('Quotation update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update quotation')
    } finally {
      setLoading(false)
    }
  }

  const updateQuotationStatus = async (quotationId, status, notes = '') => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/mechanic/quotations/${quotationId}/status`,
        { status, notes },
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchQuotations() // Refresh quotations
        await fetchAssignedVehicles() // Refresh vehicles
        return data.quotation
      }
    } catch (error) {
      console.error('Quotation status update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update quotation status')
    } finally {
      setLoading(false)
    }
  }

  // Service Functions
  const fetchServices = async (status = '') => {
    try {
      setLoading(true)
      const params = status ? `?status=${status}` : ''
      const { data } = await axios.get(`${backendUrl}/api/mechanic/services${params}`, getAuthHeaders())
      if (data.success) {
        setServices(data.services)
        return data.services
      }
    } catch (error) {
      console.error('Services fetch error:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveServices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/mechanic/services/active`, getAuthHeaders())
      if (data.success) {
        return data.services
      }
    } catch (error) {
      console.error('Active services fetch error:', error)
      toast.error('Failed to load active services')
      return []
    }
  }

  const startService = async (quotationId) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${backendUrl}/api/mechanic/services/start/${quotationId}`,
        {},
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Service started successfully')
        await fetchServices() // Refresh services
        await fetchAssignedVehicles() // Refresh vehicles
        return data.service
      }
    } catch (error) {
      console.error('Service start error:', error)
      toast.error(error.response?.data?.message || 'Failed to start service')
    } finally {
      setLoading(false)
    }
  }

  const updateServiceProgress = async (serviceId, progressData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/mechanic/services/${serviceId}/progress`,
        progressData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success('Service progress updated')
        await fetchServices() // Refresh services
        return data.service
      }
    } catch (error) {
      console.error('Service progress update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update service progress')
    } finally {
      setLoading(false)
    }
  }

  const completeService = async (serviceId, completionData) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(
        `${backendUrl}/api/mechanic/services/${serviceId}/complete`,
        completionData,
        getAuthHeaders()
      )
      if (data.success) {
        toast.success(data.message)
        await fetchServices() // Refresh services
        await fetchAssignedVehicles() // Refresh vehicles
        return data.service
      }
    } catch (error) {
      console.error('Service completion error:', error)
      toast.error(error.response?.data?.message || 'Failed to complete service')
    } finally {
      setLoading(false)
    }
  }

  // Load initial data when user changes
  useEffect(() => {
    if (user?.role === 'mechanic' && user?.token) {
      fetchDashboard()
      fetchAssignedVehicles()
      fetchQuotations()
      fetchServices()
      fetchLowStockParts()
    }
  }, [user])

  const value = {
    // State
    loading,
    dashboard,
    vehicles,
    quotations,
    services,
    parts,
    lowStockParts,

    // Dashboard
    fetchDashboard,

    // Vehicle functions
    fetchAssignedVehicles,
    updateVehicleStatus,

    // Parts functions
    fetchAllParts,
    fetchCompatibleParts,
    fetchLowStockParts,

    // Quotation functions
    fetchQuotations,
    createQuotation,
    updateQuotation,
    updateQuotationStatus,

    // Service functions
    fetchServices,
    fetchActiveServices,
    startService,
    updateServiceProgress,
    completeService
  }

  return (
    <MechanicContext.Provider value={value}>
      {children}
    </MechanicContext.Provider>
  )
}

export default MechanicContext
