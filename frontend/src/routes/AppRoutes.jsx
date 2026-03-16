import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Gallery from "../pages/Gallery";
import Success from "../pages/Success";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}