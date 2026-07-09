'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Ícono azul por defecto (Zonas normales)
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Ícono verde destacado (Para la zona base del usuario activo)
const userBaseIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Coordenadas operativas de PorterWay en Quito
const QUITO_ZONES = [
  { name: "La Mariscal", coords: [-0.2039, -78.4907] },
  { name: "Iñaquito y La Carolina", coords: [-0.1806, -78.4799] },
  { name: "Centro Histórico", coords: [-0.2201, -78.5123] },
  { name: "La Ronda", coords: [-0.2238, -78.5147] },
  { name: "San Juan", coords: [-0.2145, -78.5098] },
  { name: "La Floresta", coords: [-0.2052, -78.4820] },
  { name: "González Suárez", coords: [-0.1983, -78.4795] },
  { name: "Solanda y La Magdalena", coords: [-0.2743, -78.5361] },
  { name: "Quitumbe", coords: [-0.2954, -78.5448] },
  { name: "Cumbayá", coords: [-0.2014, -78.4346] },
  { name: "Valle de los Chillos", coords: [-0.2974, -78.4526] }
];

// Componente buscador interno
function SearchField() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      searchLabel: 'Buscar calles o lugares en Quito...',
    });
    map.addControl(searchControl);
    return () => { map.removeControl(searchControl); };
  }, [map]);
  return null;
}

// Sub-componente interactivo: Un marcador que consulta el Core al darle clic
function ZoneMarker({ zone, isUserZone }: { zone: any, isUserZone: boolean }) {
  const [topPorters, setTopPorters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Cuando haces clic en el marcador, llama a tu API del Core
  // En components/Map.tsx
const fetchZoneRanking = async () => {
    if (hasFetched) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/core/rankings?categoryId=0&zone=${encodeURIComponent(zone.name)}`);
      const json = await res.json();
      if (json.success) {
        setTopPorters(json.topPorters.slice(0, 3));
      }
    } catch (error) {
      console.error("Error consultando ranking de zona:", error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
};

  return (
    <Marker 
      position={zone.coords as [number, number]} 
      icon={isUserZone ? userBaseIcon : defaultIcon}
      eventHandlers={{ click: fetchZoneRanking }}
    >
      <Popup>
        <div style={{ minWidth: '220px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
            {zone.name} {isUserZone && '🏠 (Tu Base)'}
          </h3>
          
          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>
            🏆 Top Transportistas Activos:
          </p>
          
          {loading ? (
            <p style={{ margin: 0, fontStyle: 'italic' }}>Calculando eficiencia del core...</p>
          ) : topPorters.length === 0 ? (
            <p style={{ margin: 0, color: '#e74c3c' }}>Sin datos suficientes en esta zona.</p>
          ) : (
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#2c3e50' }}>
              {topPorters.map((porter, idx) => (
                <li key={porter.porterId} style={{ marginBottom: '5px' }}>
                  <strong>#{idx + 1} {porter.firstName}</strong> <br/>
                  <span style={{ fontSize: '0.8rem', color: '#16a085' }}>Eficiencia: {porter.finalEfficiencyScore}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// MAPA PRINCIPAL
export default function Map({ userZone }: { userZone?: string }) {
  // Centramos el mapa de forma general en Quito
  const center: [number, number] = [-0.180653, -78.467834];

  return (
    <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchField />
      
      {/* Dibujamos todos los marcadores interactivos */}
      {QUITO_ZONES.map((zone) => (
        <ZoneMarker 
          key={zone.name} 
          zone={zone} 
          isUserZone={zone.name === userZone} 
        />
      ))}
    </MapContainer>
  );
}