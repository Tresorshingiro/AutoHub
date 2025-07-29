import React, { useState, useEffect } from 'react'
import { useManager } from '../../context/ManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { 
  DollarSign,
  Calendar,
  Download,
  FileText,
  TrendingUp,
  Users,
  Calculator,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Search
} from 'lucide-react'

const ManagerPayroll = () => {
  const { 
    employees, 
    payrolls, 
    loading, 
    fetchEmployees, 
    generatePayroll, 
    fetchPayrolls,
    downloadPayrollCSV 
  } = useManager()

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [payrollData, setPayrollData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editFormData, setEditFormData] = useState({
    overtime: 0,
    bonuses: 0,
    customDeductions: 0
  })

  useEffect(() => {
    fetchEmployees()
    // Fetch all payrolls initially
    fetchPayrolls()
  }, [])

  useEffect(() => {
    // Fetch payrolls when filters change (only if not initial load)
    const filters = {}
    if (selectedMonth && selectedYear) {
      filters.month = selectedMonth
      filters.year = selectedYear
    }
    fetchPayrolls(filters)
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    // Calculate payroll data when employees change
    if (employees.length > 0) {
      const calculatedPayroll = employees.map(employee => {
        const baseSalary = employee.salary || 0
        const overtime = 0 // Can be edited by manager
        const bonuses = 0 // Can be edited by manager
        
        // Deductions breakdown:
        // - Tax: 10% of gross salary (Rwanda tax system)
        // - RSSB (Social Security): 3% of gross salary
        // - Health Insurance: 2.5% of gross salary
        const taxDeduction = baseSalary * 0.10
        const socialSecurityDeduction = baseSalary * 0.03
        const healthInsuranceDeduction = baseSalary * 0.025
        const totalDeductions = taxDeduction + socialSecurityDeduction + healthInsuranceDeduction
        
        const grossSalary = baseSalary + overtime + bonuses
        const netSalary = grossSalary - totalDeductions

        return {
          employeeId: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.role,
          baseSalary,
          overtime,
          bonuses,
          grossSalary,
          taxDeduction,
          socialSecurityDeduction,
          healthInsuranceDeduction,
          deductions: totalDeductions,
          netSalary,
          status: employee.status
        }
      })
      setPayrollData(calculatedPayroll)
    }
  }, [employees])

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const filteredPayrollData = payrollData.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const totalPayroll = filteredPayrollData.reduce((sum, emp) => sum + emp.netSalary, 0)
  const totalDeductions = filteredPayrollData.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalGross = filteredPayrollData.reduce((sum, emp) => sum + emp.grossSalary, 0)

  const handleEditPayroll = (employee) => {
    setSelectedEmployee(employee)
    setEditFormData({
      overtime: employee.overtime || 0,
      bonuses: employee.bonuses || 0,
      customDeductions: 0
    })
    setShowEditModal(true)
  }

  const handleUpdatePayroll = () => {
    if (!selectedEmployee) return

    const updatedPayrollData = payrollData.map(emp => {
      if (emp.employeeId === selectedEmployee.employeeId) {
        const baseSalary = emp.baseSalary
        const overtime = parseFloat(editFormData.overtime) || 0
        const bonuses = parseFloat(editFormData.bonuses) || 0
        const customDeductions = parseFloat(editFormData.customDeductions) || 0
        
        // Standard deductions
        const taxDeduction = baseSalary * 0.10
        const socialSecurityDeduction = baseSalary * 0.03
        const healthInsuranceDeduction = baseSalary * 0.025
        const totalDeductions = taxDeduction + socialSecurityDeduction + healthInsuranceDeduction + customDeductions
        
        const grossSalary = baseSalary + overtime + bonuses
        const netSalary = grossSalary - totalDeductions

        return {
          ...emp,
          overtime,
          bonuses,
          grossSalary,
          taxDeduction,
          socialSecurityDeduction,
          healthInsuranceDeduction,
          deductions: totalDeductions,
          netSalary
        }
      }
      return emp
    })

    setPayrollData(updatedPayrollData)
    setShowEditModal(false)
    setSelectedEmployee(null)
  }

  const handleGeneratePayroll = async () => {
    try {
      await generatePayroll({
        month: selectedMonth,
        year: selectedYear,
        employees: filteredPayrollData
      })
      setShowGenerateModal(false)
      // Refresh payrolls with current filters
      const filters = {}
      if (selectedMonth && selectedYear) {
        filters.month = selectedMonth
        filters.year = selectedYear
      }
      fetchPayrolls(filters)
    } catch (error) {
      console.error('Error generating payroll:', error)
    }
  }

  const handleDownloadPayroll = async (payroll) => {
    try {
      await downloadPayrollCSV(payroll.year, payroll.month)
    } catch (error) {
      console.error('Error downloading payroll:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Employee Name', 'Role', 'Base Salary', 'Overtime', 'Bonuses', 'Deductions', 'Net Salary']
    const csvContent = [
      headers.join(','),
      ...filteredPayrollData.map(emp => [
        `"${emp.firstName} ${emp.lastName}"`,
        emp.role,
        emp.baseSalary,
        emp.overtime,
        emp.bonuses,
        emp.deductions,
        emp.netSalary
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `payroll-${selectedMonth}-${selectedYear}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600 mt-2">Generate and manage employee payroll with detailed breakdown</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => setShowGenerateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Generate Payroll
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{filteredPayrollData.length}</p>
                </div>
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gross Payroll</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalGross.toLocaleString()} RWF</p>
                </div>
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                  <p className="text-xl lg:text-2xl font-bold text-red-600">{totalDeductions.toLocaleString()} RWF</p>
                  <p className="text-xs text-gray-500 mt-1">Tax + RSSB + Health</p>
                </div>
                <CreditCard className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Payroll</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{totalPayroll.toLocaleString()} RWF</p>
                </div>
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 lg:p-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:w-auto lg:flex lg:space-x-4">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select 
                  value={selectedMonth.toString()} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value.toString()}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <select 
                  value={selectedYear.toString()} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {years.map(year => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedMonth(new Date().getMonth() + 1)
                    setSelectedYear(new Date().getFullYear())
                    setSearchTerm('')
                    setFilterStatus('all')
                  }}
                  className="whitespace-nowrap"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Details</CardTitle>
            <CardDescription>
              Payroll for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              <br />
              <span className="text-sm text-blue-600">
                Deductions include: Tax (10%), RSSB/Social Security (3%), Health Insurance (2.5%)
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600 min-w-[150px]">Employee</th>
                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                    <th className="text-left p-3 font-medium text-gray-600">Base Salary</th>
                    <th className="text-left p-3 font-medium text-gray-600">Overtime</th>
                    <th className="text-left p-3 font-medium text-gray-600">Bonuses</th>
                    <th className="text-left p-3 font-medium text-gray-600">Gross</th>
                    <th className="text-left p-3 font-medium text-gray-600">Deductions</th>
                    <th className="text-left p-3 font-medium text-gray-600">Net Salary</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrollData.map((employee) => (
                    <tr key={employee.employeeId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900 min-w-0">
                          <div className="truncate">{employee.firstName} {employee.lastName}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {employee.role}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium text-sm">
                        {employee.baseSalary.toLocaleString()} RWF
                      </td>
                      <td className="p-3 text-sm">
                        {employee.overtime.toLocaleString()} RWF
                      </td>
                      <td className="p-3 text-sm">
                        {employee.bonuses.toLocaleString()} RWF
                      </td>
                      <td className="p-3 font-medium text-sm text-blue-600">
                        {employee.grossSalary.toLocaleString()} RWF
                      </td>
                      <td className="p-3 text-sm">
                        <div className="text-red-600">
                          -{employee.deductions.toLocaleString()} RWF
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Tax: {employee.taxDeduction.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-sm text-green-600">
                        {employee.netSalary.toLocaleString()} RWF
                      </td>
                      <td className="p-3">
                        <Badge 
                          className={employee.status === 'active' ? 'bg-green-100 text-green-800 text-xs' : 'bg-red-100 text-red-800 text-xs'}
                        >
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPayroll(employee)}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-gray-50">
                    <td className="p-3 font-bold">TOTAL</td>
                    <td className="p-3"></td>
                    <td className="p-3 font-bold">{filteredPayrollData.reduce((sum, emp) => sum + emp.baseSalary, 0).toLocaleString()} RWF</td>
                    <td className="p-3 font-bold">{filteredPayrollData.reduce((sum, emp) => sum + emp.overtime, 0).toLocaleString()} RWF</td>
                    <td className="p-3 font-bold">{filteredPayrollData.reduce((sum, emp) => sum + emp.bonuses, 0).toLocaleString()} RWF</td>
                    <td className="p-3 font-bold text-blue-600">{totalGross.toLocaleString()} RWF</td>
                    <td className="p-3 font-bold text-red-600">-{totalDeductions.toLocaleString()} RWF</td>
                    <td className="p-3 font-bold text-green-600">{totalPayroll.toLocaleString()} RWF</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

      {/* Recent Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payroll History</CardTitle>
          <CardDescription>
            Payroll records for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
            {payrolls && payrolls.length > 0 && ` (${payrolls.length} records found)`}
            <br />
            <Button 
              variant="link" 
              size="sm"
              onClick={() => fetchPayrolls({})}
              className="text-blue-600 p-0 h-auto"
            >
              Click here to show all payroll records
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrolls && payrolls.length > 0 ? (
              payrolls.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Payroll - {months.find(m => m.value === record.month)?.label} {record.year}
                      </p>
                      <p className="text-sm text-gray-500">
                        {record.employeeCount} employees • {record.totalAmount?.toLocaleString()} RWF
                      </p>
                      {record.processedBy && (
                        <p className="text-xs text-gray-400">Processed by: {record.processedBy}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDownloadPayroll(record)}
                      title="Download CSV"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No payroll history found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try selecting a different month/year or generate payroll for this period
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        {/* Edit Payroll Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Payroll</DialogTitle>
              <DialogDescription>
                Update overtime, bonuses, and additional deductions for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Current Salary</h4>
                <p className="text-sm text-gray-600">
                  Base Salary: <span className="font-medium">{selectedEmployee?.baseSalary.toLocaleString()} RWF</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime Pay (RWF)
                </label>
                <Input
                  type="number"
                  value={editFormData.overtime}
                  onChange={(e) => setEditFormData({...editFormData, overtime: e.target.value})}
                  placeholder="Enter overtime amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonuses (RWF)
                </label>
                <Input
                  type="number"
                  value={editFormData.bonuses}
                  onChange={(e) => setEditFormData({...editFormData, bonuses: e.target.value})}
                  placeholder="Enter bonus amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Deductions (RWF)
                </label>
                <Input
                  type="number"
                  value={editFormData.customDeductions}
                  onChange={(e) => setEditFormData({...editFormData, customDeductions: e.target.value})}
                  placeholder="Additional deductions (loans, etc.)"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Standard deductions (Tax 10%, RSSB 3%, Health 2.5%) are automatically calculated.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdatePayroll}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Payroll
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Generate Payroll Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Payroll</DialogTitle>
            <DialogDescription>
              Generate payroll for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Payroll Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Total Employees:</span>
                  <span className="font-medium ml-2">{filteredPayrollData.length}</span>
                </div>
                <div>
                  <span className="text-blue-700">Gross Amount:</span>
                  <span className="font-medium ml-2">{totalGross.toLocaleString()} RWF</span>
                </div>
                <div>
                  <span className="text-blue-700">Total Deductions:</span>
                  <span className="font-medium ml-2">{totalDeductions.toLocaleString()} RWF</span>
                </div>
                <div>
                  <span className="text-blue-700">Net Amount:</span>
                  <span className="font-medium ml-2">{totalPayroll.toLocaleString()} RWF</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                This will generate payroll for all active employees. Make sure all data is correct before proceeding.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowGenerateModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGeneratePayroll}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Generate Payroll
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export default ManagerPayroll
