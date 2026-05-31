import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BucketProvider } from './context/BucketContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/ExplorePage'
import CountryDetailPage from './pages/CountryDetailPage'
import BucketListPage from './pages/BucketListPage'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/explore" element={
          <ProtectedRoute><ExplorePage /></ProtectedRoute>
        } />
        <Route path="/country/:code" element={
          <ProtectedRoute><CountryDetailPage /></ProtectedRoute>
        } />
        <Route path="/bucket-list" element={
          <ProtectedRoute><BucketListPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BucketProvider>
        <AppRoutes />
      </BucketProvider>
    </AuthProvider>
  )
}
