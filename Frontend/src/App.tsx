import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
// Dashboard pages
import PatientDashboard from './pages/dashboard/PatientDashboard';
import CaregiverDashboard from './pages/dashboard/CaregiverDashboard';
// Protected route component
import ProtectedRoute from './components/auth/ProtectedRoute';
export function App() {
  return <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Protected Routes */}
              <Route path="/patient-dashboard/*" element={<ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>} />
              <Route path="/caregiver-dashboard/*" element={<ProtectedRoute requiredRole="caregiver">
                    <CaregiverDashboard />
                  </ProtectedRoute>} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>;
}