import { useState, useRef } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export default function SearchBar({ onLocationSet }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        countrycodes: 'ar',
      });
      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { 'User-Agent': 'BarriosPopularesMap/1.0' },
      });
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onLocationSet({ lat: parseFloat(lat), lng: parseFloat(lon), label: display_name });
      }
    } catch {
      // silently ignore search errors — user sees nothing happen
    } finally {
      setSearching(false);
    }
  }

  function handleGps() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSet({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Mi ubicación',
        });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  }

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar dirección o barrio..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
      />
      <button
        type="submit"
        className={`search-btn${searching ? ' loading' : ''}`}
        disabled={searching}
        aria-label="Buscar"
      >
        {searching ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </button>
      <div className="search-divider" />
      <button
        type="button"
        className={`gps-btn${locating ? ' loading' : ''}`}
        onClick={handleGps}
        disabled={locating}
        aria-label="Usar mi ubicación"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
        </svg>
      </button>
    </form>
  );
}
