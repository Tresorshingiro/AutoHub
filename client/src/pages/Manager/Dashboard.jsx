import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManager } from '../../context/ManagerContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { 
  Users,
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Car,
  Package,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  Wallet
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

const ManagerDashboard = () => {
  const navigate = useNavigate()
  const { 
    dashboard, 
    loading, 
    fetchDashboard 
  } = useManager()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading manager dashboard...</div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">No dashboard data available</div>
      </div>
    )
  }

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Executive overview and business management</p>
        </div>
        <Button onClick={fetchDashboard} variant="outline" className="w-fit">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Executive Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  RWF {dashboard?.financial?.totalRevenue?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Overall business income
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  RWF {dashboard?.financial?.netProfit?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-blue-600">
                  {dashboard?.financial?.profitMargin || 0}% margin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboard?.employees?.total || 0}
                </p>
                <p className="text-xs text-purple-600">
                  Monthly payroll: RWF {dashboard?.employees?.monthlyPayroll?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Vehicles Serviced</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboard?.operations?.totalVehicles || 0}
                </p>
                <p className="text-xs text-orange-600">
                  This month: {dashboard?.operations?.monthlyVehicles || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations & Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Service Workflow Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Service Workflow Status
            </CardTitle>
            <CardDescription>Real-time operations monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">In Queue</span>
                <span className="text-2xl font-bold text-blue-600">
                  {dashboard?.operations?.workflow?.inQueue || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium">In Service</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {dashboard?.operations?.workflow?.inService || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Completed</span>
                <span className="text-2xl font-bold text-green-600">
                  {dashboard?.operations?.workflow?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium">Payment Cleared</span>
                <span className="text-2xl font-bold text-purple-600">
                  {dashboard?.operations?.workflow?.cleared || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Revenue vs expenses comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard?.monthlyPerformance?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard.monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`
                      }
                      return value.toString()
                    }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `RWF ${value.toLocaleString()}`, 
                      name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Profit'
                    ]} 
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Manager */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Management Actions</CardTitle>
            <CardDescription>Core management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/manager/employees')}
                className="flex items-center justify-center p-4 h-auto"
              >
                <Users className="w-5 h-5 mr-2" />
                <span>Manage Staff</span>
              </Button>
              <Button 
                onClick={() => navigate('/manager/payroll')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <Wallet className="w-5 h-5 mr-2" />
                <span>Payroll</span>
              </Button>
              <Button 
                onClick={() => navigate('/manager/operations')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <Activity className="w-5 h-5 mr-2" />
                <span>Operations</span>
              </Button>
              <Button 
                onClick={() => navigate('/manager/suppliers')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <Building2 className="w-5 h-5 mr-2" />
                <span>Suppliers</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Key Alerts</CardTitle>
            <CardDescription>Important notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard?.alerts?.pending?.length > 0 ? (
                dashboard.alerts.pending.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-3" />
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-500">{alert.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-orange-600">
                      {alert.count}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No pending alerts
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <UserCheck className="w-4 h-4 mr-2 text-green-600" />
              Employee Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {dashboard?.employees?.performance?.average || 0}%
            </p>
            <p className="text-xs text-gray-500">Average productivity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Service Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {dashboard?.operations?.efficiency?.averageTime || 0}h
            </p>
            <p className="text-xs text-gray-500">Average service time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Package className="w-4 h-4 mr-2 text-orange-600" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {dashboard?.inventory?.lowStockItems || 0}
            </p>
            <p className="text-xs text-gray-500">Low stock alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Building2 className="w-4 h-4 mr-2 text-purple-600" />
              Active Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {dashboard?.suppliers?.active || 0}
            </p>
            <p className="text-xs text-gray-500">Total suppliers: {dashboard?.suppliers?.total || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ManagerDashboard
