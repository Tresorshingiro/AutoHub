import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    // Dashboard state
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Employee management state
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // Reports state
    const [reportData, setReportData] = useState(null);
    const [reportType, setReportType] = useState('employees');
    const [dateRange, setDateRange] = useState('month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const token = localStorage.getItem('adminToken');
    const API_BASE_URL = 'http://localhost:5000/api/admin';

    const axiosConfig = {
        headers: {
            atoken: token,
        },
    };

    // Dashboard functions
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/dashboard`, axiosConfig);
            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Employee management functions
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/get-all-employees`, axiosConfig);
            if (response.data.success) {
                setEmployees(response.data.employees);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeById = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/get-employee/${id}`, axiosConfig);
            if (response.data.success) {
                setSelectedEmployee(response.data.employee);
                return response.data.employee;
            } else {
                setError(response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
            setError('Failed to fetch employee');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (employeeData) => {
        try {
            setLoading(true);
            setError(null);
            
            const formData = new FormData();
            Object.keys(employeeData).forEach(key => {
                formData.append(key, employeeData[key]);
            });

            const response = await axios.post(`${API_BASE_URL}/add-employee`, formData, {
                headers: {
                    atoken: token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                await fetchEmployees(); // Refresh the list
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add employee';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id, employeeData) => {
        try {
            setLoading(true);
            setError(null);
            
            const formData = new FormData();
            Object.keys(employeeData).forEach(key => {
                if (employeeData[key] !== null && employeeData[key] !== undefined) {
                    formData.append(key, employeeData[key]);
                }
            });

            const response = await axios.patch(`${API_BASE_URL}/update-employee/${id}`, formData, {
                headers: {
                    atoken: token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                await fetchEmployees(); // Refresh the list
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update employee';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.delete(`${API_BASE_URL}/delete-employee/${id}`, axiosConfig);
            if (response.data.success) {
                await fetchEmployees(); // Refresh the list
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete employee';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const changeEmployeePassword = async (id, passwordData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.patch(`${API_BASE_URL}/change-password/${id}`, passwordData, axiosConfig);
            if (response.data.success) {
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Reports functions
    const generateReport = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let startDate, endDate;
            const now = new Date();
            
            // Calculate date range based on selection
            switch (dateRange) {
                case 'week':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    endDate = now;
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    break;
                case 'quarter':
                    const quarter = Math.floor(now.getMonth() / 3);
                    startDate = new Date(now.getFullYear(), quarter * 3, 1);
                    endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    endDate = new Date(now.getFullYear(), 11, 31);
                    break;
                case 'custom':
                    startDate = new Date(customStartDate);
                    endDate = new Date(customEndDate);
                    break;
                default:
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            }

            const params = new URLSearchParams({
                reportType,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });

            const response = await axios.get(`${API_BASE_URL}/reports?${params}`, axiosConfig);
            if (response.data.success) {
                setReportData(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch dashboard data on mount
    useEffect(() => {
        fetchDashboardData();
        fetchEmployees();
    }, []);

    // Auto-generate report when parameters change
    useEffect(() => {
        generateReport();
    }, [reportType, dateRange, customStartDate, customEndDate]);

    const value = {
        // Dashboard
        dashboardData,
        fetchDashboardData,
        
        // Employees
        employees,
        selectedEmployee,
        setSelectedEmployee,
        fetchEmployees,
        fetchEmployeeById,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        changeEmployeePassword,
        
        // Reports
        reportData,
        reportType,
        setReportType,
        dateRange,
        setDateRange,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        generateReport,
        
        // General
        loading,
        error,
        setError
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
