import { useRef, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

const CARTO_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

// IGN WMS — cuerpos de agua e hidrografía como indicador de riesgo hídrico
const FLOOD_WMS = 'https://wms.ign.gob.ar/geoserver/ows';

const DEFAULT_CENTER = [-34.6037, -58.3816];
const DEFAULT_ZOOM = 11;

const STYLE_DEFAULT  = { fillColor: '#14b8a6', color: '#14b8a6', fillOpacity: 0.35, weight: 1 };
const STYLE_SELECTED = { fillColor: '#7c3aed', color: '#a78bfa', fillOpacity: 0.55, weight: 2 };

const yellowIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#fbbf24;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 3px rgba(251,191,36,0.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapRefSetter({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 14, { duration: 1.2 });
  }, [position, map]);
  return null;
}

// Fly to URL params on first load
function InitialPosition({ onFound }) {
  const map = useMap();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat'));
    const lng = parseFloat(params.get('lng'));
    const barrio = params.get('barrio');
    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 15, { duration: 0 });
      onFound?.({ lat, lng, label: barrio ? decodeURIComponent(barrio) : 'Compartido' });
    }
  }, []);
  return null;
}

function LayerNode({ node, color, defaultName }) {
  if (!node.lat || !node.lon) return null;
  return (
    <CircleMarker
      key={node.id}
      center={[node.lat, node.lon]}
      radius={5}
      pathOptions={{ fillColor: color, color: color, fillOpacity: 0.85, weight: 0 }}
    >
      <Popup>
        <span style={{ color: '#0f0f0f', fontSize: 13 }}>
          {node.tags?.name || defaultName}
        </span>
      </Popup>
    </CircleMarker>
  );
}

export default function MapView({
  geojson,
  selectedBarrio,
  onBarrioClick,
  searchPosition,
  mapRef,
  layers,
  activeLayers,
  onLocationFromUrl,
}) {
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer(layer => {
      const sel = layer.feature === selectedBarrio;
      layer.setStyle(sel ? STYLE_SELECTED : STYLE_DEFAULT);
      if (sel) layer.bringToFront();
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
        style={{ width: '100%', height: '100%' }}
        attributionControl
      >
        <TileLayer url={CARTO_DARK} attribution={CARTO_ATTR} />
        <MapRefSetter mapRef={mapRef} />
        <FlyTo position={searchPosition} />
        <InitialPosition onFound={onLocationFromUrl} />

        {/* Flood risk — IGN hydrography WMS */}
        {activeLayers.flood && (
          <WMSTileLayer
            url={FLOOD_WMS}
            layers="ign:hidrografia_l,ign:cuerpos_de_agua"
            format="image/png"
            transparent
            opacity={0.55}
            attribution="IGN Argentina"
          />
        )}

        {/* Barrio polygons */}
        {geojson && (
          <GeoJSON
            key={geojson?.features?.length ?? 0}
            ref={geoJsonRef}
            data={geojson}
            style={STYLE_DEFAULT}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Search marker */}
        {searchPosition && (
          <Marker position={[searchPosition.lat, searchPosition.lng]} icon={yellowIcon}>
            {searchPosition.label && <Popup>{searchPosition.label}</Popup>}
          </Marker>
        )}

        {/* Dynamic OSM layers */}
        {activeLayers.health && layers.health.data.map(n => (
          <LayerNode key={`h${n.id}`} node={n} color="#60a5fa" defaultName="Centro de salud" />
        ))}
        {activeLayers.police && layers.police.data.map(n => (
          <LayerNode key={`p${n.id}`} node={n} color="#f472b6" defaultName="Comisaría" />
        ))}
        {activeLayers.schools && layers.schools.data.map(n => (
          <LayerNode key={`s${n.id}`} node={n} color="#a3e635" defaultName="Escuela" />
        ))}
        {activeLayers.transit && layers.transit.data.map(n => (
          <LayerNode key={`t${n.id}`} node={n} color="#fb923c" defaultName="Parada" />
        ))}
      </MapContainer>
    </div>
  );
}
