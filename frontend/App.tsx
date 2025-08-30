import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "./pages/HomePage";
import VideoDetailPage from "./pages/VideoDetailPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoDetailPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
