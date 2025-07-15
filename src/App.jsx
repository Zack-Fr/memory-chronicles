import React from "react";
import { Routes, Route} from 'react-router-dom'
import MessageBoardPage from './pages/MessageBoard/MessageBoardPage';
import LandingPage from './pages/LandingPage/LandingPage'


function App(){
  return (
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/write" element={<MessageBoardPage />} />
</Routes>
  );
}

export default App;