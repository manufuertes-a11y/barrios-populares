import { useState, useCallback } from 'react';
import { bboxFromBounds } from '../utils/geo';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const QUERIES = {
  health:   (b) => `[out:json][timeout:20];(node["amenity"~"hospital|clinic|health_post|doctors|pharmacy"](${b}););out body;`,
  police:   (b) => `[out:json][timeout:20];(node["amenity"="police"](${b}););out body;`,
  schools:  (b) => `[out:json][timeout:20];(node["amenity"~"school|kindergarten|university|college"](${b}););out body;`,
  transit:  (b) => `[out:json][timeout:20];(node["highway"="bus_stop"](${b});node["amenity"="bus_station"](${b}););out body;`,
};

function makeState() {
  return { data: [], loading: false };
}

export function useOverpass() {
  const [layers, setLayers] = useState({
    health:  makeState(),
    police:  makeState(),
    schools: makeState(),
    transit: makeState(),
  });

  const fetchLayer = useCallback(async (type, bounds) => {
    const bbox = bboxFromBounds(bounds);
    const query = QUERIES[type](bbox);

    setLayers(prev => ({ ...prev, [type]: { ...prev[type], loading: true } }));
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const json = await res.json();
      setLayers(prev => ({ ...prev, [type]: { data: json.elements || [], loading: false } }));
    } catch {
      setLayers(prev => ({ ...prev, [type]: { data: [], loading: false } }));
    }
  }, []);

  const clearLayer = useCallback((type) => {
    setLayers(prev => ({ ...prev, [type]: makeState() }));
  }, []);

  return { layers, fetchLayer, clearLayer };
}
