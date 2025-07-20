import React from "react";
import {Routes, Route} from 'react-router-dom'

import MessageBoardPage from './pages/MessageBoard/MessageBoardPage';
import LandingPage from './pages/LandingPage/LandingPage'
import AuthPage from './pages/AuthPage/AuthPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/write" element={<MessageBoardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />    
        
      </Routes>
    
  )
}

export default App