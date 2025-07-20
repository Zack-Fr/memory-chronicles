import React from "react";
import {Routes, Route } from 'react-router-dom'

import MessageBoardPage from './pages/MessageBoard/MessageBoardPage';
import LandingPage from './pages/LandingPage/LandingPage'
import AuthPage from './pages/AuthPage/AuthPage'
import { AuthProvider } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage/DashboardPage'

function App() {
  return (
    <AuthProvider>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/write" element={<MessageBoardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />    
        
      </Routes>
      </AuthProvider>
    
  )
}

export default App