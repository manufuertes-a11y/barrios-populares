import { useRef, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

const CARTO_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const DEFAULT_CENTER = [-34.6037, -58.3816];
const DEFAULT_ZOOM = 11;

const STYLE_DEFAULT = {
  fillColor: '#14b8a6',
  color: '#14b8a6',
  fillOpacity: 0.35,
  weight: 1,
};

const STYLE_SELECTED = {
  fillColor: '#7c3aed',
  color: '#a78bfa',
  fillOpacity: 0.55,
  weight: 2,
};

const yellowIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;
    background:#fbbf24;
    border:2px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 3px rgba(251,191,36,0.35);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Sub-component that exposes mapRef to parent
function MapRefSetter({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// Flies to a position when it changes
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 14, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

export default function MapView({
  geojson,
  selectedBarrio,
  onBarrioClick,
  searchPosition,
  mapRef,
  healthData,
  policeData,
}) {
  const geoJsonRef = useRef(null);

  // Re-style when selection changes
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer((layer) => {
      const isSelected = layer.feature === selectedBarrio;
      layer.setStyle(isSelected ? STYLE_SELECTED : STYLE_DEFAULT);
      if (isSelected) layer.bringToFront();
    });
  }, [selectedBarrio]);

  const onEachFeature = useCallback((feature, layer) => {
    layer.on('click', () => onBarrioClick(feature));
  }, [onBarrioClick]);

  return (
    <div className="map-container">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        <TileLayer url={CARTO_DARK} attribution={CARTO_ATTR} />
        <MapRefSetter mapRef={mapRef} />
        <FlyTo position={searchPosition} />

        {geojson && (
          <GeoJSON
            key={geojson?.features?.length ?? 0}
            ref={geoJsonRef}
            data={geojson}
            style={STYLE_DEFAULT}
            onEachFeature={onEachFeature}
          />
        )}

        {searchPosition && (
          <Marker
            position={[searchPosition.lat, searchPosition.lng]}
            icon={yellowIcon}
          >
            {searchPosition.label && (
              <Popup>{searchPosition.label}</Popup>
            )}
          </Marker>
        )}

        {healthData.map((node) => (
          <CircleMarker
            key={`h-${node.id}`}
            center={[node.lat, node.lon]}
            radius={6}
            pathOptions={{
              fillColor: '#60a5fa',
              color: '#60a5fa',
              fillOpacity: 0.8,
              weight: 1,
            }}
          >
            <Popup>
              <span style={{ color: '#111' }}>
                {node.tags?.name || 'Centro de salud'}
              </span>
            </Popup>
          </CircleMarker>
        ))}

        {policeData.map((node) => (
          <CircleMarker
            key={`p-${node.id}`}
            center={[node.lat, node.lon]}
            radius={6}
            pathOptions={{
              fillColor: '#fb923c',
              color: '#fb923c',
              fillOpacity: 0.8,
              weight: 1,
            }}
          >
            <Popup>
              <span style={{ color: '#111' }}>
                {node.tags?.name || 'Comisaría'}
              </span>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
