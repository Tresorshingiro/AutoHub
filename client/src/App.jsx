import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Roles from './components/Roles'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Reception/Dashboard'
import AddVehicle from './pages/Reception/AddVehicle'
import InService from './pages/Reception/InService'
import ClearedVehicles from './pages/Reception/ClearedVehicles'
import {Toaster} from 'react-hot-toast'

// Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Roles />
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

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
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
      </Routes>
    </div>
  )
}

export default App
