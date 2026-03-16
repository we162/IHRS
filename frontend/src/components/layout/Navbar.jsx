import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-black text-white flex justify-between p-6">
      <h1 className="text-xl font-bold">Horse Club</h1>

      <div className="space-x-6">
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/booking">Book Ride</Link>
      </div>
    </nav>
  );
}