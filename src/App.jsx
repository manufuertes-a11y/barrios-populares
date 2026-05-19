import { useRef, useState, useCallback } from 'react';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import BarrioDrawer from './components/BarrioDrawer';
import LayerPanel from './components/LayerPanel';
import HistoryModal from './components/HistoryModal';
import RightsList from './components/RightsList';
import { useReNaBaP } from './hooks/useReNaBaP';
import { useOverpass } from './hooks/useOverpass';

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

const INITIAL_ACTIVE = { flood: false, health: false, police: false, schools: false, transit: false };

export default function App() {
  const { geojson, loading, error, isFallback } = useReNaBaP();
  const { layers, fetchLayer, clearLayer } = useOverpass();

  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const [activeLayers, setActiveLayers] = useState(INITIAL_ACTIVE);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [historyBarrio, setHistoryBarrio] = useState(null);
  const [rightsBarrio, setRightsBarrio] = useState(null);
  const [photosBarrio, setPhotosBarrio] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const mapRef = useRef(null);

  const handleBarrioClick = useCallback(feature => setSelectedBarrio(feature), []);
  const handleDrawerClose = useCallback(() => setSelectedBarrio(null), []);
  const handleLocationSet = useCallback(pos => setSearchPosition(pos), []);

  function toggleLayer(id) {
    const next = !activeLayers[id];
    setActiveLayers(prev => ({ ...prev, [id]: next }));

    if (id === 'flood') return; // WMS, no Overpass needed

    if (next) {
      if (mapRef.current) fetchLayer(id, mapRef.current.getBounds());
    } else {
      clearLayer(id);
    }
  }

  function activateLayerFromRights(id) {
    if (!activeLayers[id]) toggleLayer(id);
  }

  const loadingLayers = Object.fromEntries(
    Object.keys(layers).map(k => [k, layers[k].loading])
  );

  const showBanner = !bannerDismissed && (error || isFallback);

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
        layers={layers}
        activeLayers={activeLayers}
        onLocationFromUrl={handleLocationSet}
      />

      <SearchBar onLocationSet={handleLocationSet} />

      {showBanner && (
        <div className={`banner${error ? ' banner-error' : ' banner-warn'}`}>
          <span>{error ? '⚠️' : 'ℹ️'}</span>
          <div className="banner-text">
            <strong>{isFallback && !error ? 'Datos de muestra' : 'Aviso'}</strong>
            {error || 'Mostrando datos de muestra del GBA. Los datos oficiales no están disponibles.'}
          </div>
          <button className="banner-close" onClick={() => setBannerDismissed(true)}>×</button>
        </div>
      )}

      {/* Layer FAB */}
      <button
        className={`layer-fab${layerPanelOpen ? ' active' : ''}`}
        onClick={() => setLayerPanelOpen(o => !o)}
      >
        <LayersIcon />
        Capas
      </button>

      <LayerPanel
        open={layerPanelOpen}
        onClose={() => setLayerPanelOpen(false)}
        active={activeLayers}
        loadingLayers={loadingLayers}
        onToggle={toggleLayer}
      />

      <BarrioDrawer
        barrio={selectedBarrio}
        onClose={handleDrawerClose}
        searchPosition={searchPosition}
        onShowHistory={setHistoryBarrio}
        onShowRights={setRightsBarrio}
        onShowPhotos={setPhotosBarrio}
      />

      {historyBarrio && (
        <HistoryModal barrio={historyBarrio} onClose={() => setHistoryBarrio(null)} />
      )}

      {rightsBarrio && (
        <RightsList
          barrio={rightsBarrio}
          onClose={() => setRightsBarrio(null)}
          onActivateLayer={activateLayerFromRights}
        />
      )}

      {photosBarrio && (
        <div className="modal-overlay" onClick={() => setPhotosBarrio(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Fotos — {photosBarrio.properties?.nombre_barrio}</div>
              <button className="modal-close" onClick={() => setPhotosBarrio(null)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', paddingTop: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Próximamente</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                La función de fotos estará disponible cuando configuremos Supabase.
                Pasá el URL de tu proyecto de Supabase y lo activamos.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="attribution-custom">
        ReNaBaP · Secretaría de Integración Socio Urbana · SISU Argentina
      </div>
    </div>
  );
}
