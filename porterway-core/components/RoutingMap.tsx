'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconShadow: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function RoutingMap({ onRouteSet }: { onRouteSet: (distance: number) => void }) {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  function MapInteraction() {
    useMapEvents({
      click(e) {
        if (!origin || (origin && destination)) {
          setOrigin([e.latlng.lat, e.latlng.lng]);
          setDestination(null);
          onRouteSet(0);
        } else if (!destination) {
          setDestination([e.latlng.lat, e.latlng.lng]);
          const dist = e.latlng.distanceTo(L.latLng(origin[0], origin[1]));
          onRouteSet(dist / 1000); // Enviamos la distancia en Kilómetros
        }
      }
    });
    return null;
  }

  return (
    <MapContainer center={[-0.180653, -78.467834]} zoom={13} style={{ width: '100%', height: '100%', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapInteraction />
      
      {origin && <Marker position={origin} icon={customIcon}><Popup>📍 Origen</Popup></Marker>}
      {destination && <Marker position={destination} icon={customIcon}><Popup>🎯 Destino</Popup></Marker>}
      
      {origin && destination && (
        <Polyline positions={[origin, destination]} color="#e74c3c" weight={4} dashArray="10, 10" />
      )}
    </MapContainer>
  );
}