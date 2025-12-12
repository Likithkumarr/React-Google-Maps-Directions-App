import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Helper component for recentering (with smooth animation)
function RecenterMap({ position }) {
  const map = useMap();
  map.flyTo(position, 13, { duration: 2 }); // smooth 2s animation
  return null;
}

function MyMap() {
  const [position, setPosition] = useState([28.6139, 77.209]); // Default: New Delhi
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setPosition([parseFloat(lat), parseFloat(lon)]);
    } else {
      alert("Location not found!");
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          style={{ padding: "5px", width: "250px" }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} style={{ marginLeft: "5px", padding: "5px" }}>
          Search
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>{query || "Default Location"}</Popup>
        </Marker>

        {/* 👇 Insert this helper inside the MapContainer */}
        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
}

export default MyMap;
