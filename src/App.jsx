import React from "react";
import {Routes, Route } from 'react-router-dom'

import MessageBoardPage from './pages/MessageBoard/MessageBoardPage';
import LandingPage from './pages/LandingPage/LandingPage'
import AuthPage from './pages/AuthPage/AuthPage'
import { AuthProvider } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import MessageDetailPage from './pages/MessageDetailPage/MessageDetailPage'
import WorldMapPage from './pages/WorldMapPage/WorldMapPage'
import PublicListPage from './pages/PublicListPage/PublicListPage'
// import WorldMapPage     from './pages/WorldMapPage/WorldMapPage'
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/write" element={<MessageBoardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />   
        <Route path="/capsules/:id" element={<MessageDetailPage />} /> 
        <Route path="/map" element={<WorldMapPage />} />
        <Route path="/public/:countryCode" element={<PublicListPage />} />
      </Routes>
      </AuthProvider>
    
  )
}

export default App