import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccountant } from '../../context/AccountantContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Car,
  Package,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import {
  LineChart,
  Line,
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
  AreaChart,
  Area
} from 'recharts'

const AccountantDashboard = () => {
  const navigate = useNavigate()
  const { 
    dashboard, 
    loading, 
    fetchDashboard 
  } = useAccountant()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
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

  // Payment status colors - specific mapping
  const PAYMENT_STATUS_COLORS = {
    'Paid': '#10B981',      // Green
    'Partial': '#F59E0B',   // Orange  
    'Unpaid': '#EF4444'     // Red
  }

  // Use monthly financial data from the last 12 months
  const monthlyRevenueData = dashboard?.monthlyFinancialData || []

  const serviceTypeData = dashboard?.serviceTypes || []
  const paymentStatusData = dashboard?.paymentStatus || [
    { name: 'Paid', value: dashboard?.payments?.paid || 0, amount: dashboard?.payments?.totalPaidAmount || 0 },
    { name: 'Partial', value: dashboard?.payments?.partiallyPaid || 0, amount: dashboard?.payments?.totalPartialAmount || 0 },
    { name: 'Unpaid', value: dashboard?.payments?.unpaid || 0, amount: dashboard?.payments?.totalUnpaidAmount || 0 }
  ]
  const dailyIncomeData = dashboard?.dailyIncome || []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
          <p className="text-gray-600 mt-1">Financial overview and business analytics</p>
        </div>
        <Button onClick={fetchDashboard} variant="outline" className="w-fit">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  RWF {dashboard?.financial?.overall?.income?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Overall income
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  RWF {dashboard?.financial?.overall?.expenses?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-red-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Overall expenses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Services</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboard?.payments?.totalVehicles || 0}
                </p>
                <p className="text-xs text-blue-600 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Total vehicles serviced
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  RWF {dashboard?.payments?.outstandingAmount?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-orange-600">
                  {(dashboard?.payments?.unpaid || 0) + (dashboard?.payments?.partiallyPaid || 0)} vehicles pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Monthly Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Monthly Financial Summary
            </CardTitle>
            <CardDescription>Current month revenue and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Monthly Income</span>
                <span className="text-2xl font-bold text-green-600">
                  RWF {dashboard?.financial?.monthly?.income?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="font-medium">Monthly Expenses</span>
                <span className="text-2xl font-bold text-red-600">
                  RWF {dashboard?.financial?.monthly?.expenses?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Monthly Profit</span>
                <span className="text-2xl font-bold text-blue-600">
                  RWF {dashboard?.financial?.monthly?.profit?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Payment Status Distribution
            </CardTitle>
            <CardDescription>Vehicle payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatusData.length > 0 && paymentStatusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={paymentStatusData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} vehicles (RWF ${props.payload.amount?.toLocaleString() || '0'})`, 
                      name
                    ]} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No payment data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Income vs Expenses
            </CardTitle>
            <CardDescription>Monthly financial comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
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
                      name === 'income' ? 'Income' : 'Expenses'
                    ]} 
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No financial data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Overall Financial Performance
            </CardTitle>
            <CardDescription>Total business performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Total Profit</span>
                <span className="text-2xl font-bold text-blue-600">
                  RWF {dashboard?.financial?.overall?.profit?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium">Profit Margin</span>
                <span className="text-2xl font-bold text-purple-600">
                  {dashboard?.financial?.overall?.profitMargin || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
                <span className="font-medium">Total Vehicles</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {dashboard?.payments?.totalVehicles || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common accounting tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/accountant/cleared-vehicles')}
                className="flex items-center justify-center p-4 h-auto"
              >
                <FileText className="w-5 h-5 mr-2" />
                <span>Create Invoice</span>
              </Button>
              <Button 
                onClick={() => navigate('/accountant/income')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                <span>Record Income</span>
              </Button>
              <Button 
                onClick={() => navigate('/accountant/expenses')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <TrendingDown className="w-5 h-5 mr-2" />
                <span>Record Expense</span>
              </Button>
              <Button 
                onClick={() => navigate('/accountant/inventory')}
                variant="outline" 
                className="flex items-center justify-center p-4 h-auto"
              >
                <Package className="w-5 h-5 mr-2" />
                <span>Manage Inventory</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboard?.recentActivity?.payments || []).slice(0, 4).map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">{payment.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()} - {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="font-semibold text-green-600">
                    +RWF {payment.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              {(dashboard?.recentActivity?.expenses || []).slice(0, 2).map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">{expense.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleDateString()} - {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="font-semibold text-red-600">
                    -RWF {expense.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              {(!dashboard?.recentActivity?.payments?.length && !dashboard?.recentActivity?.expenses?.length) && (
                <div className="text-center text-gray-500 py-4">
                  No recent transactions available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              This Month's Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              RWF {(dashboard?.financial?.monthly?.profit || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Monthly Revenue - Monthly Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-orange-600" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {dashboard?.alerts?.pendingPaymentsCount || 0}
            </p>
            <p className="text-xs text-gray-500">Vehicles awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {(dashboard?.alerts?.lowStockCount || 0) + (dashboard?.alerts?.outOfStockCount || 0)}
            </p>
            <p className="text-xs text-gray-500">Low/Out of stock items</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccountantDashboard
