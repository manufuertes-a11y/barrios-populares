import { useState, useEffect } from 'react';

const RENABAP_URL =
  'https://infra.datos.gob.ar/catalog/social/renabap/dataset/1/distribution/1.1/download/barrios-populares.geojson';
const CACHE_KEY = 'renabap_data';
const FALLBACK_PATH = `${import.meta.env.BASE_URL}data/fallback-barrios.json`;

export function useReNaBaP() {
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. Try localStorage cache first (instant, works offline)
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (!cancelled) {
            setGeojson(parsed);
            setLoading(false);
          }
          // Still attempt a background refresh if online
          if (navigator.onLine) refreshInBackground(cancelled);
          return;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      // 2. Try fetching from ReNaBaP
      try {
        const res = await fetch(RENABAP_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        if (!cancelled) {
          setGeojson(data);
          setLoading(false);
        }
      } catch (err) {
        // 3. Fallback to local dataset
        const isCors = err instanceof TypeError;
        if (!cancelled) {
          setError(
            isCors
              ? 'No se pudo acceder a los datos oficiales (CORS). Mostrando datos de muestra del GBA.'
              : `Error al cargar datos: ${err.message}. Mostrando datos de muestra.`
          );
        }
        await loadFallback(cancelled);
      }
    }

    async function refreshInBackground(cancelled) {
      try {
        const res = await fetch(RENABAP_URL);
        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        if (!cancelled) setGeojson(data);
      } catch {
        // silently ignore background refresh failures
      }
    }

    async function loadFallback(cancelled) {
      try {
        const res = await fetch(FALLBACK_PATH);
        const data = await res.json();
        if (!cancelled) {
          setGeojson(data);
          setIsFallback(true);
          setLoading(false);
        }
      } catch (fallbackErr) {
        if (!cancelled) {
          setError('No se pudieron cargar los datos. Revisá tu conexión a internet.');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { geojson, loading, error, isFallback };
}
