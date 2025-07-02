import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Use a simple div icon so we don't rely on external image assets
const customIcon = L.divIcon({
  className: '',
  html:
    '<div style="background:#d00;border:2px solid #fff;border-radius:50%;width:16px;height:16px;box-shadow:0 0 2px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function MapPreview({ lat, lng }) {
  if (!lat || !lng) {
    return null;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );
}
