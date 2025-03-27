// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  // Handle search input change
  const onChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 p-4 text-white flex justify-between items-center shadow-lg">
      {/* Logo/Title */}
      <div>
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition duration-300"
        >
          ⚡ EV Charger Locator
        </Link>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex gap-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={onChange}
          placeholder="Search location..."
          className="p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded transition duration-300"
        >
          Search
        </button>

        {/* Login and Create Account Links */}
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md transition duration-300"
        >
          Create Account
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
