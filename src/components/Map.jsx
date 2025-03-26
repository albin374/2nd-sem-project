// src/components/Map.js
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
  { lat: 10.526, lng: 76.2144 }, // Palakkad
  { lat: 9.9312, lng: 76.2673 }, // Kochi
];

// Icon for charging stations
const chargingStationIcon = {
  url: "https://img.freepik.com/premium-vector/electrical-charging-station-icon_617585-1877.jpg",
  scaledSize: { width: 30, height: 30 }, // Icon size
};

const Map = () => {
  const [hoveredStation, setHoveredStation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  // Fetch place name using Geocoding API
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

  // Handle mouse over for station info
  const handleMouseOver = async (station) => {
    const name = await getPlaceName(station.lat, station.lng);
    setHoveredStation(station);
    setPlaceName(name);
  };

  // Hide InfoWindow on mouse out
  const handleMouseOut = () => {
    setHoveredStation(null);
    setPlaceName("");
  };

  // Search and move map to searched location
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
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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
              position={station}
              icon={chargingStationIcon}
              onMouseOver={() => handleMouseOver(station)}
              onMouseOut={handleMouseOut}
            />
          ))}

          {/* Show InfoWindow on hover */}
          {hoveredStation && (
            <InfoWindow
              position={hoveredStation}
              options={{ disableAutoPan: true }}
            >
              <div>
                <strong>📍 {placeName}</strong>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
