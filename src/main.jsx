import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'
import App from "./App.jsx";
import "./styles/global.css";

// import Navbar from "./components/Navbar/Navbar.jsx"

ReactDom.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <AuthProvider>
    <App />
    </ AuthProvider >
    {/* <Navbar/> */}
    </BrowserRouter>
);