import { useState, useCallback } from 'react';
import { bboxFromBounds } from '../utils/geo';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const QUERIES = {
  health: (bbox) =>
    `[out:json][timeout:15];(node["amenity"~"hospital|clinic|health_post|doctors"](${bbox}););out body;`,
  police: (bbox) =>
    `[out:json][timeout:15];(node["amenity"="police"](${bbox}););out body;`,
};

export function useOverpass() {
  const [healthData, setHealthData] = useState([]);
  const [policeData, setPoliceData] = useState([]);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingPolice, setLoadingPolice] = useState(false);

  const fetchLayer = useCallback(async (type, bounds) => {
    const bbox = bboxFromBounds(bounds);
    const query = QUERIES[type](bbox);
    const setter = type === 'health' ? setHealthData : setPoliceData;
    const loadSetter = type === 'health' ? setLoadingHealth : setLoadingPolice;

    loadSetter(true);
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const json = await res.json();
      setter(json.elements || []);
    } catch {
      setter([]);
    } finally {
      loadSetter(false);
    }
  }, []);

  const clearLayer = useCallback((type) => {
    if (type === 'health') setHealthData([]);
    else setPoliceData([]);
  }, []);

  return { healthData, policeData, loadingHealth, loadingPolice, fetchLayer, clearLayer };
}
