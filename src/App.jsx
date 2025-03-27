// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Signup from "./pages/Signup"; // Import Signup correctly
import Login from "./pages/Login";   // Import Login correctly

const App = () => {
  // Define searchQuery and setSearchQuery
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null); // To store searched location

  // Handle search and pass location to Map
  const handleSearch = async () => {
    if (!searchQuery) {
      alert("Please enter a location to search.");
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setSearchedLocation(location); // Set searched location for Map
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location.");
    }
  };

  return (
    <Router>
      {/* Pass searchQuery, setSearchQuery, and handleSearch to Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <Routes>
        {/* Pass searchedLocation to Map */}
        <Route path="/" element={<Map searchedLocation={searchedLocation} />} />
        {/* Add route for Signup */}
        <Route path="/signup" element={<Signup />} />
        {/* Add route for Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
