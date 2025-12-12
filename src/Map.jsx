import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Helper: auto-fit map to markers
function FitBounds({ start, end, route }) {
  const map = useMap();

  useEffect(() => {
    if (start && end) {
      const bounds = [start, end];
      map.fitBounds(bounds, { padding: [50, 50] }); // auto zoom to fit
    } else if (route.length > 0) {
      map.fitBounds(route, { padding: [50, 50] });
    }
  }, [start, end, route, map]);

  return null;
}

function Map() {
  const [start, setStart] = useState([12.9716, 77.5946]); // Default: Bangalore
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState([]);

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  // 🔍 Convert place name → lat/lng
  const getCoords = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  // 🚗 Fetch route from OSRM
  const getRoute = async (startPos, endPos) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startPos[1]},${startPos[0]};${endPos[1]},${endPos[0]}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);
    }
  };

  const handleSearch = async () => {
    const fromCoords = await getCoords(fromQuery || "Bangalore");
    const toCoords = await getCoords(toQuery);

    if (fromCoords) setStart(fromCoords);
    if (toCoords) setEnd(toCoords);

    if (fromCoords && toCoords) {
      getRoute(fromCoords, toCoords);
    } else {
      alert("Location not found!");
    }
  };

  return (
    <div>
      <h2>🚗 Directions Map</h2>

      {/* Search Inputs */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="From (e.g. Bangalore)"
          value={fromQuery}
          onChange={(e) => setFromQuery(e.target.value)}
          style={{ padding: "5px", marginRight: "5px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="To (e.g. Hyderabad)"
          value={toQuery}
          onChange={(e) => setToQuery(e.target.value)}
          style={{ padding: "5px", marginRight: "5px", width: "200px" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px 10px" }}>
          Get Directions
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={start}
        zoom={6}
        style={{ height: "580px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Start Marker */}
        {start && (
          <Marker position={start}>
            <Popup>Start: {fromQuery || "Default (Bangalore)"}</Popup>
          </Marker>
        )}

        {/* End Marker */}
        {end && (
          <Marker position={end}>
            <Popup>End: {toQuery}</Popup>
          </Marker>
        )}

        {/* Route Line */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}

        {/* ✅ Auto-fit bounds */}
        <FitBounds start={start} end={end} route={route} />
      </MapContainer>
    </div>
  );
}

export default Map;
