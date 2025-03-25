import React from "react";

const Header = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white animate-fade-in">
          ⚡ EV Charger Locator
        </h1>
        <button className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-100 transition-transform transform hover:scale-105 duration-300">
          🚗 Book Now
        </button>
      </div>
    </nav>
  );
};

export default Header;
