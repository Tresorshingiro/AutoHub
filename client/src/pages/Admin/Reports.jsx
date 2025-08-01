import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { FileText, Download, Calendar, Users, DollarSign, Car, TrendingUp, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const {
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
        loading,
        error
    } = useAdmin();

    const reportTypes = [
        { value: 'employees', label: 'Employee Report', icon: Users },
        { value: 'financial', label: 'Financial Report', icon: DollarSign },
        { value: 'vehicles', label: 'Vehicle Report', icon: Car }
    ];

    const dateRanges = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' }
    ];

    // Export to Excel
    const exportToExcel = () => {
        if (!reportData) return;

        let data = [];
        let filename = '';

        switch (reportType) {
            case 'employees':
                data = reportData.employees.map(emp => ({
                    'Name': `${emp.firstName} ${emp.lastName}`,
                    'Email': emp.email,
                    'Phone': emp.phone,
                    'Role': emp.role,
                    'Salary': emp.salary,
                    'Status': emp.status,
                    'Join Date': new Date(emp.createdAt).toLocaleDateString()
                }));
                filename = 'employee_report.xlsx';
                break;
            case 'financial':
                // Combine income and expenses
                const incomeData = reportData.incomes.map(item => ({
                    'Date': new Date(item.date).toLocaleDateString(),
                    'Type': 'Income',
                    'Description': item.description,
                    'Amount': item.amount,
                    'Category': item.category || 'N/A'
                }));
                const expenseData = reportData.expenses.map(item => ({
                    'Date': new Date(item.date).toLocaleDateString(),
                    'Type': 'Expense',
                    'Description': item.description,
                    'Amount': item.amount,
                    'Category': item.category || 'N/A'
                }));
                data = [...incomeData, ...expenseData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
                filename = 'financial_report.xlsx';
                break;
            case 'vehicles':
                data = reportData.vehicles.map(vehicle => ({
                    'Owner': vehicle.customer?.name || 'N/A',
                    'Make': vehicle.make,
                    'Model': vehicle.model,
                    'Year': vehicle.year,
                    'License Plate': vehicle.licensePlate,
                    'Status': vehicle.status,
                    'Date Added': new Date(vehicle.createdAt).toLocaleDateString(),
                    'Issue': vehicle.issue
                }));
                filename = 'vehicle_report.xlsx';
                break;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, filename);
    };

    // Export to PDF
    const exportToPDF = () => {
        if (!reportData) return;

        const doc = new jsPDF();
        const title = `${reportTypes.find(r => r.value === reportType)?.label} - AutoHub`;
        
        doc.setFontSize(20);
        doc.text(title, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

        let tableData = [];
        let columns = [];

        switch (reportType) {
            case 'employees':
                columns = ['Name', 'Email', 'Role', 'Salary', 'Status'];
                tableData = reportData.employees.map(emp => [
                    `${emp.firstName} ${emp.lastName}`,
                    emp.email,
                    emp.role,
                    `$${emp.salary?.toLocaleString()}`,
                    emp.status
                ]);
                break;
            case 'financial':
                columns = ['Date', 'Type', 'Description', 'Amount'];
                const incomeRows = reportData.incomes.map(item => [
                    new Date(item.date).toLocaleDateString(),
                    'Income',
                    item.description,
                    `$${item.amount.toLocaleString()}`
                ]);
                const expenseRows = reportData.expenses.map(item => [
                    new Date(item.date).toLocaleDateString(),
                    'Expense',
                    item.description,
                    `$${item.amount.toLocaleString()}`
                ]);
                tableData = [...incomeRows, ...expenseRows];
                break;
            case 'vehicles':
                columns = ['Owner', 'Vehicle', 'License Plate', 'Status'];
                tableData = reportData.vehicles.map(vehicle => [
                    vehicle.customer?.name || 'N/A',
                    `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
                    vehicle.licensePlate,
                    vehicle.status
                ]);
                break;
        }

        doc.autoTable({
            head: [columns],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8 }
        });

        doc.save(`${reportType}_report.pdf`);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
                <p className="text-gray-600 mt-2">Generate and export comprehensive system reports</p>
            </div>

            {/* Report Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Report Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report Type
                            </label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center">
                                                <type.icon className="h-4 w-4 mr-2" />
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date Range
                            </label>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateRanges.map((range) => (
                                        <SelectItem key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end space-x-2">
                            <Button 
                                onClick={generateReport}
                                className="bg-gradient-hero text-white"
                                disabled={loading}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Generate Report
                            </Button>
                        </div>
                    </div>

                    {dateRange === 'custom' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <p className="text-red-600">Error: {error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Report Results */}
            {reportData && (
                <>
                    {/* Export Actions */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-semibold">
                                        {reportTypes.find(r => r.value === reportType)?.label}
                                    </h3>
                                    <Badge variant="secondary" className="text-sm">
                                        {reportData.summary ? Object.keys(reportData.summary).length : 0} metrics
                                    </Badge>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={exportToExcel}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Excel
                                    </Button>
                                    <Button variant="outline" onClick={exportToPDF}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export PDF
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    {reportData.summary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(reportData.summary).map(([key, value]) => (
                                <Card key={key}>
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {typeof value === 'number' && key.toLowerCase().includes('amount') || key.toLowerCase().includes('income') || key.toLowerCase().includes('expense') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('salary') 
                                                    ? `$${value.toLocaleString()}` 
                                                    : value.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Detailed Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Report Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reportType === 'employees' && reportData.employees && (
                                <EmployeeReportTable employees={reportData.employees} />
                            )}
                            {reportType === 'financial' && (
                                <FinancialReportTable 
                                    incomes={reportData.incomes} 
                                    expenses={reportData.expenses} 
                                />
                            )}
                            {reportType === 'vehicles' && reportData.vehicles && (
                                <VehicleReportTable vehicles={reportData.vehicles} />
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

// Employee Report Table
const EmployeeReportTable = ({ employees }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                    <tr key={employee._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {employee.firstName} {employee.lastName}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.email}</div>
                            <div className="text-sm text-gray-500">{employee.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="capitalize">{employee.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${employee.salary?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                                className={employee.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                            >
                                {employee.status}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(employee.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Financial Report Table
const FinancialReportTable = ({ incomes, expenses }) => {
    const combinedData = [
        ...incomes.map(item => ({ ...item, type: 'Income' })),
        ...expenses.map(item => ({ ...item, type: 'Expense' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {combinedData.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                    className={item.type === 'Income' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }
                                >
                                    {item.type}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.category || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={item.type === 'Income' ? 'text-green-600' : 'text-red-600'}>
                                    ${item.amount.toLocaleString()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Vehicle Report Table
const VehicleReportTable = ({ vehicles }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                    <tr key={vehicle._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {vehicle.customer?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {vehicle.customer?.email || ''}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm text-gray-500">
                                {vehicle.year}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vehicle.licensePlate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="capitalize">
                                {vehicle.status.replace('-', ' ')}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(vehicle.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {vehicle.issue}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Reports;
