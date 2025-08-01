import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Users, UserCheck, UserX, Car, Wrench, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
    const { dashboardData, loading, error } = useAdmin();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-600">No dashboard data available</p>
            </div>
        );
    }

    const { overview, employeesByRole, recentEmployees, employeeGrowth } = dashboardData;

    // Color schemes
    const ROLE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    
    const statCards = [
        {
            title: 'Total Employees',
            value: overview.totalEmployees,
            icon: Users,
            change: `${overview.activeEmployees} active`,
            changeType: 'positive'
        },
        {
            title: 'Active Employees',
            value: overview.activeEmployees,
            icon: UserCheck,
            change: `${overview.inactiveEmployees} inactive`,
            changeType: overview.inactiveEmployees === 0 ? 'positive' : 'neutral'
        },
        {
            title: 'Total Vehicles',
            value: overview.totalVehicles,
            icon: Car,
            change: `${overview.vehiclesInService} in service`,
            changeType: 'neutral'
        },
        {
            title: 'Completed Services',
            value: overview.completedVehicles,
            icon: CheckCircle,
            change: `${overview.vehiclesInService} pending`,
            changeType: 'positive'
        },
        {
            title: 'Monthly Income',
            value: `$${overview.monthlyIncome.toLocaleString()}`,
            icon: TrendingUp,
            change: 'This month',
            changeType: 'positive'
        },
        {
            title: 'Monthly Expenses',
            value: `$${overview.monthlyExpenses.toLocaleString()}`,
            icon: TrendingDown,
            change: 'This month',
            changeType: 'negative'
        },
        {
            title: 'Total Payroll',
            value: `$${overview.totalPayroll.toLocaleString()}`,
            icon: DollarSign,
            change: 'Monthly obligation',
            changeType: 'neutral'
        },
        {
            title: 'Net Profit',
            value: `$${(overview.monthlyIncome - overview.monthlyExpenses).toLocaleString()}`,
            icon: overview.monthlyIncome > overview.monthlyExpenses ? TrendingUp : TrendingDown,
            change: 'This month',
            changeType: overview.monthlyIncome > overview.monthlyExpenses ? 'positive' : 'negative'
        }
    ];

    const getChangeColor = (type) => {
        switch (type) {
            case 'positive': return 'text-green-600';
            case 'negative': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Comprehensive overview of AutoHub operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                        <p className={`text-sm mt-1 ${getChangeColor(stat.changeType)}`}>
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <IconComponent className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee Distribution by Role */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Distribution by Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={employeesByRole}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="role"
                                    >
                                        {employeesByRole.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name?.charAt(0).toUpperCase() + name?.slice(1)]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {employeesByRole.map((entry, index) => (
                                <div key={entry.role} className="flex items-center">
                                    <div 
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
                                    ></div>
                                    <span className="text-sm capitalize">{entry.role} ({entry.count})</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Growth Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Growth (Last 6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={employeeGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Employees and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Employees */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentEmployees.length > 0 ? (
                                recentEmployees.map((employee) => (
                                    <div key={employee._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {employee.firstName} {employee.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600 capitalize">{employee.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                employee.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {employee.status}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(employee.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent employees</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* System Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <Car className="h-8 w-8 text-blue-600" />
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">{overview.totalVehicles}</p>
                                            <p className="text-sm text-blue-600">Total Vehicles</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <Wrench className="h-8 w-8 text-orange-600" />
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-orange-600">{overview.vehiclesInService}</p>
                                            <p className="text-sm text-orange-600">In Service</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">{overview.completedVehicles}</p>
                                        <p className="text-sm text-green-600">Completed Services</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <DollarSign className="h-8 w-8 text-purple-600" />
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-purple-600">
                                            ${(overview.monthlyIncome - overview.monthlyExpenses).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-purple-600">Monthly Net Profit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
