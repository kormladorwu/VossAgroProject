import FundingHub from "./fundingHub";
import AIInsight from "./aiInsight";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Marketplace from "./marketplace";
import LandAccess from "./landAccess"; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/funding" element={<FundingHub />} />
        <Route path="/land" element={<LandAccess />} /> 
        <Route path="/ai" element={<AIInsight />} />
      </Routes>
    </Router>
  );
}
