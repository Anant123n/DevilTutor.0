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

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alakh" element={<AlakhSir />} />
          <Route path="/viva" element={<VivaTopic />} />
          <Route path="/viva/questions" element={<VivaQuestion />} />
          <Route path="/viva/result" element={<VivaResult />} />
          <Route path="/pdf-tutor" element={<PdfTutor />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
