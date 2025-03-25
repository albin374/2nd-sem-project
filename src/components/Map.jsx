import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

// Center of Kerala
const center = {
  lat: 10.8505,
  lng: 76.2711,
};

// Bounds to restrict the map to Kerala
const keralaBounds = {
  north: 12.744,
  south: 8.090,
  west: 74.856,
  east: 77.719,
};

// Charging station coordinates in Kerala
const chargingStations = [
  { lat: 10.8505, lng: 76.2711 }, // Thrissur
  { lat: 10.5260, lng: 76.2144 }, // Palakkad
  { lat: 9.9312, lng: 76.2673 }, // Kochi
];

// Icon for charging stations
const chargingStationIcon = {
  url: "https://img.freepik.com/premium-vector/electrical-charging-station-icon_617585-1877.jpg",
  scaledSize: { width: 30, height: 30 }, // Icon size
};

const Map = () => {
  // State to store hovered station info
  const [hoveredStation, setHoveredStation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null); // To reference the map

  // Function to get place name using Geocoding API
  const getPlaceName = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return "Location name not found.";
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Error fetching location name.";
    }
  };

  // Handle mouse over to fetch and show place name
  const handleMouseOver = async (station) => {
    const name = await getPlaceName(station.lat, station.lng);
    setHoveredStation(station);
    setPlaceName(name);
  };

  // Handle mouse out to hide the InfoWindow
  const handleMouseOut = () => {
    setHoveredStation(null);
    setPlaceName("");
  };

  // Search for a location and move map to that place
  const handleSearch = async () => {
    if (!searchQuery) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;

        // Move the map to the searched location
        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(12);
        }
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location.");
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      {/* Navbar with Search Bar */}
      <nav style={styles.navbar}>
        <h1 style={styles.title}>⚡ EV Charger Locator</h1>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search a location"
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>
      </nav>

      {/* Google Map Component */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={7}
        center={center}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          restriction: {
            latLngBounds: keralaBounds,
            strictBounds: true,
          },
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Render charging station markers */}
        {chargingStations.map((station, index) => (
          <Marker
            key={index}
            position={{ lat: station.lat, lng: station.lng }}
            icon={chargingStationIcon}
            onMouseOver={() => handleMouseOver(station)}
            onMouseOut={handleMouseOut}
          />
        ))}

        {/* Show InfoWindow while hovering */}
        {hoveredStation && (
          <InfoWindow
            position={{
              lat: hoveredStation.lat,
              lng: hoveredStation.lng,
            }}
            options={{
              disableAutoPan: true,
            }}
          >
            <div>
              <strong>📍 {placeName}</strong>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

// Navbar & Search Bar styles
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  searchContainer: {
    display: "flex",
    gap: "8px",
  },
  searchInput: {
    padding: "8px",
    fontSize: "14px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #bdc3c7",
  },
  searchButton: {
    padding: "8px 12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Map;
