import { useRef, useState, useCallback } from 'react';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import BarrioDrawer from './components/BarrioDrawer';
import LayerControls from './components/LayerControls';
import { useReNaBaP } from './hooks/useReNaBaP';
import { useOverpass } from './hooks/useOverpass';

export default function App() {
  const { geojson, loading, error, isFallback } = useReNaBaP();
  const { healthData, policeData, loadingHealth, loadingPolice, fetchLayer, clearLayer } =
    useOverpass();

  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const [showHealth, setShowHealth] = useState(false);
  const [showPolice, setShowPolice] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const mapRef = useRef(null);

  const handleBarrioClick = useCallback((feature) => {
    setSelectedBarrio(feature);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setSelectedBarrio(null);
  }, []);

  const handleLocationSet = useCallback((pos) => {
    setSearchPosition(pos);
  }, []);

  function toggleHealth() {
    if (showHealth) {
      setShowHealth(false);
      clearLayer('health');
    } else {
      setShowHealth(true);
      if (mapRef.current) fetchLayer('health', mapRef.current.getBounds());
    }
  }

  function togglePolice() {
    if (showPolice) {
      setShowPolice(false);
      clearLayer('police');
    } else {
      setShowPolice(true);
      if (mapRef.current) fetchLayer('police', mapRef.current.getBounds());
    }
  }

  const showBanner = !bannerDismissed && (error || isFallback);
  const bannerMsg =
    error ||
    'Mostrando datos de muestra del GBA. Los datos oficiales no están disponibles en este momento.';

  return (
    <div className="app">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Cargando barrios populares…</div>
        </div>
      )}

      <MapView
        geojson={geojson}
        selectedBarrio={selectedBarrio}
        onBarrioClick={handleBarrioClick}
        searchPosition={searchPosition}
        mapRef={mapRef}
        healthData={showHealth ? healthData : []}
        policeData={showPolice ? policeData : []}
      />

      <SearchBar onLocationSet={handleLocationSet} />

      {showBanner && (
        <div className={`banner${error ? ' banner-error' : ' banner-warn'}`}>
          <span className="banner-icon">{error ? '⚠️' : 'ℹ️'}</span>
          <div className="banner-text">
            <strong>{isFallback && !error ? 'Datos de muestra' : 'Aviso'}</strong>
            {bannerMsg}
          </div>
          <button className="banner-close" onClick={() => setBannerDismissed(true)}>
            ×
          </button>
        </div>
      )}

      <LayerControls
        showHealth={showHealth}
        showPolice={showPolice}
        loadingHealth={loadingHealth}
        loadingPolice={loadingPolice}
        onToggleHealth={toggleHealth}
        onTogglePolice={togglePolice}
      />

      <BarrioDrawer
        barrio={selectedBarrio}
        onClose={handleDrawerClose}
        searchPosition={searchPosition}
      />

      <div className="attribution-custom">
        ReNaBaP · Secretaría de Integración Socio Urbana · SISU Argentina
      </div>
    </div>
  );
}
