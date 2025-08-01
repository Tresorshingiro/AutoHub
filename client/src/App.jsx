import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Roles from './components/Roles'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Reception/Dashboard'
import AddVehicle from './pages/Reception/AddVehicle'
import InService from './pages/Reception/InService'
import ClearedVehicles from './pages/Reception/ClearedVehicles'
import MechanicDashboard from './pages/Mechanic/Dashboard'
import MechanicDiagnosis from './pages/Mechanic/Diagnosis'
import Quotations from './pages/Mechanic/Quotations'
import MechanicServices from './pages/Mechanic/Services'
import MechanicCompletedVehicles from './pages/Mechanic/CompletedVehicles'
import AccountantDashboard from './pages/Accountant/Dashboard'
import AccountantClearedVehicles from './pages/Accountant/ClearedVehicles'
import IncomeManagement from './pages/Accountant/Income'
import ExpenseManagement from './pages/Accountant/Expenses'
import EnhancedInventory from './pages/Accountant/Inventory'
import Suppliers from './pages/Accountant/Suppliers'
import Reports from './pages/Accountant/Reports'
import ManagerDashboard from './pages/Manager/Dashboard'
import EmployeesPage from './pages/Manager/Employees'
import PayrollPage from './pages/Manager/Payroll'
import OperationsPage from './pages/Manager/Operations'
import ReportsPage from './pages/Manager/Reports'
import { MechanicProvider } from './context/MechanicContext'
import { AccountantProvider } from './context/AccountantContext'
import { ManagerProvider } from './context/ManagerContext'
import { AdminProvider } from './context/AdminContext'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminEmployees from './pages/Admin/Employees'
import AdminReports from './pages/Admin/Reports'
import {Toaster} from 'react-hot-toast'

// Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Roles />
      <Pricing />
      <Contact />
      <CTA />
      <Footer />
    </>
  )
}

// Reception Layout Component
const ReceptionLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

// Mechanic Layout Component
const MechanicLayout = ({ children }) => {
  return (
    <MechanicProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </MechanicProvider>
  )
}

// Accountant Layout Component
const AccountantLayout = ({ children }) => {
  return (
    <AccountantProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AccountantProvider>
  )
}

// Manager Layout Component
const ManagerLayout = ({ children }) => {
  return (
    <ManagerProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ManagerProvider>
  )
}

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <AdminProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminProvider>
  )
}

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Reception Routes */}
        <Route path="/reception/dashboard" element={
          <ReceptionLayout>
            <Dashboard />
          </ReceptionLayout>
        } />
        <Route path="/reception/add-vehicle" element={
          <ReceptionLayout>
            <AddVehicle />
          </ReceptionLayout>
        } />
        <Route path="/reception/in-service" element={
          <ReceptionLayout>
            <InService />
          </ReceptionLayout>
        } />
        <Route path="/reception/cleared" element={
          <ReceptionLayout>
            <ClearedVehicles />
          </ReceptionLayout>
        } />

        {/* Mechanic Routes */}
        <Route path="/mechanic/dashboard" element={
          <MechanicLayout>
            <MechanicDashboard />
          </MechanicLayout>
        } />
        <Route path="/mechanic/diagnosis" element={
          <MechanicLayout>
            <MechanicDiagnosis />
          </MechanicLayout>
        } />
        <Route path="/mechanic/quotations" element={
          <MechanicLayout>
            <Quotations />
          </MechanicLayout>
        } />
        <Route path="/mechanic/services" element={
          <MechanicLayout>
            <MechanicServices />
          </MechanicLayout>
        } />
        <Route path="/mechanic/completed" element={
          <MechanicLayout>
            <MechanicCompletedVehicles />
          </MechanicLayout>
        } />

        {/* Accountant Routes */}
        <Route path="/accountant/dashboard" element={
          <AccountantLayout>
            <AccountantDashboard />
          </AccountantLayout>
        } />
        <Route path="/accountant/cleared-vehicles" element={
          <AccountantLayout>
            <AccountantClearedVehicles />
          </AccountantLayout>
        } />
        <Route path="/accountant/income" element={
          <AccountantLayout>
            <IncomeManagement />
          </AccountantLayout>
        } />
        <Route path="/accountant/expenses" element={
          <AccountantLayout>
            <ExpenseManagement />
          </AccountantLayout>
        } />
        <Route path="/accountant/inventory" element={
          <AccountantLayout>
            <EnhancedInventory />
          </AccountantLayout>
        } />
        <Route path="/accountant/suppliers" element={
          <AccountantLayout>
            <Suppliers />
          </AccountantLayout>
        } />
        <Route path="/accountant/reports" element={
          <AccountantLayout>
            <Reports />
          </AccountantLayout>
        } />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={
          <ManagerLayout>
            <ManagerDashboard />
          </ManagerLayout>
        } />
        <Route path="/manager/employees" element={
          <ManagerLayout>
            <EmployeesPage />
          </ManagerLayout>
        } />
        <Route path="/manager/payroll" element={
          <ManagerLayout>
            <PayrollPage />
          </ManagerLayout>
        } />
        <Route path="/manager/operations" element={
          <ManagerLayout>
            <OperationsPage />
          </ManagerLayout>
        } />
        <Route path="/manager/reports" element={
          <ManagerLayout>
            <ReportsPage />
          </ManagerLayout>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/employees" element={
          <AdminLayout>
            <AdminEmployees />
          </AdminLayout>
        } />
        <Route path="/admin/reports" element={
          <AdminLayout>
            <AdminReports />
          </AdminLayout>
        } />

      </Routes>
    </div>
  )
}

export default App
