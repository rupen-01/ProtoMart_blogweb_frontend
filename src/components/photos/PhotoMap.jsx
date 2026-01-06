import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { placesAPI } from "../../api/places.api";

const createIcon = (count) =>
  L.divIcon({
    html: `<div style="
      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
      width:40px;height:40px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:bold;
    ">${count}</div>`,
    iconSize: [40, 40],
  });

const PhotoMap = ({ preview = false }) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    placesAPI.getPlacesForMap().then((res) => {
      setPlaces(res.data || []);
    });
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={preview ? 4 : 5}
      className="w-full h-full"
      style={{ minHeight: "600px", zIndex: 0 }}
      scrollWheelZoom
      dragging
      doubleClickZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.latitude, p.longitude]}
          icon={createIcon(p.photoCount)}
          eventHandlers={{
            click: () => navigate(`/places/${p.id}`),
          }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.photoCount} photos
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PhotoMap;
