// src/pages/Coverage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import districtData from "../../assets/warehouses.json";

// Map zoomer component
const MapZoom = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 10); // Zoom level 10 for closer view
    }
  }, [position]);
  return null;
};

const Coverage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState(districtData);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = districtData.filter((district) =>
      district.district.toLowerCase().includes(value)
    );
    setFilteredDistricts(filtered);

    if (filtered.length === 1) {
      setSelectedPosition([filtered[0].latitude, filtered[0].longitude]);
    } else {
      setSelectedPosition(null); // Reset zoom
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4 text-primary">
        We are available in 64 districts
      </h2>

      {/* 🔍 Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search by district name..."
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* 🗺️ Map Display */}
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Optional Zoom on search */}
          <MapZoom position={selectedPosition} />

          {filteredDistricts.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{district.district}</p>
                  <p className="text-xs text-gray-500">
                    Region: {district.region}
                  </p>
                  <p>
                    Covered Areas:
                    <ul className="list-disc list-inside">
                      {district.covered_area.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </p>
                  <a
                    className="text-blue-500 underline text-sm"
                    href={district.flowchart}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Flowchart
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
