// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AlakhSir from "./components/AlakhSir";
import PdfTutor from "./components/PdfTutor";
import VivaQuestion from "./components/VivaQuestion";
import VivaResult from "./components/VivaResult";
import VivaTopic from "./components/VivaTopic";
import { AppContextProvider } from "./context/ContextApi";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AppShell() {
  const { showAuth } = useAuth();

  return (
    <>
      <Navbar />
      {showAuth && <Login />}
      <div className="pt-[64px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alakh" element={<Protected><AlakhSir /></Protected>} />
          <Route path="/viva" element={<Protected><VivaTopic /></Protected>} />
          <Route path="/viva/questions" element={<Protected><VivaQuestion /></Protected>} />
          <Route path="/viva/result" element={<Protected><VivaResult /></Protected>} />
          <Route path="/pdf-tutor" element={<Protected><PdfTutor /></Protected>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContextProvider>
          <AppShell />
        </AppContextProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
