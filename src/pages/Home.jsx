import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Map from "../components/Map";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto mt-10 p-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700 animate-slide-in">
          Find Nearby EV Charging Stations
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Discover the nearest charging station for your electric vehicle
          easily.
        </p>

        {/* Map Section */}
        <div className="mt-8 h-[500px] rounded-xl overflow-hidden shadow-xl">
          <Map />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
