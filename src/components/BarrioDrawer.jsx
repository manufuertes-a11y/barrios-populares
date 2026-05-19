import { useEffect } from 'react';
import ServiceChip from './ServiceChip';
import { m2ToHa, formatFamilias } from '../utils/format';
import { formatDistance } from '../utils/geo';
import { getCensoData, formatPoblacion } from '../utils/censo2022';
import { saveSnapshot } from '../utils/history';

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.95"/>
    </svg>
  );
}

function RightsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function centroidOf(geometry) {
  const coords =
    geometry?.type === 'Polygon' ? geometry.coordinates[0] :
    geometry?.type === 'MultiPolygon' ? geometry.coordinates[0][0] : [];
  if (!coords.length) return null;
  return {
    lat: coords.reduce((s, c) => s + c[1], 0) / coords.length,
    lng: coords.reduce((s, c) => s + c[0], 0) / coords.length,
  };
}

export default function BarrioDrawer({
  barrio,
  onClose,
  searchPosition,
  onShowHistory,
  onShowRights,
  onShowPhotos,
  supapbasePhotos = [],
}) {
  const isOpen = !!barrio;
  const p = barrio?.properties || {};
  const center = barrio ? centroidOf(barrio.geometry) : null;

  const censo = getCensoData(p.partido);

  const distanceText =
    searchPosition && center
      ? formatDistance(searchPosition.lat, searchPosition.lng, center.lat, center.lng)
      : null;

  // Save snapshot for history tracking when a barrio is opened
  useEffect(() => {
    if (barrio && p.nombre_barrio) {
      const id = p.id || p.nombre_barrio;
      saveSnapshot(id, p);
    }
  }, [barrio]);

  function handleShare() {
    const name = p.nombre_barrio || 'Barrio';
    const text = `${name} — ${p.partido}\n${m2ToHa(p.superficie_m2)}, ${formatFamilias(p.cantidad_familias_aproximada)} familias`;
    const url = center
      ? `${window.location.origin}${window.location.pathname}?lat=${center.lat.toFixed(5)}&lng=${center.lng.toFixed(5)}&barrio=${encodeURIComponent(name)}`
      : window.location.href;

    if (navigator.share) {
      navigator.share({ title: name, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        alert('Info copiada al portapapeles');
      }).catch(() => {});
    }
  }

  return (
    <div className={`drawer-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div className={`drawer${isOpen ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" onClick={onClose}>
          <div className="drawer-handle-bar" />
        </div>

        {barrio && (
          <div className="drawer-content">
            <div className="drawer-name">{p.nombre_barrio || 'Barrio sin nombre'}</div>
            <div className="drawer-partido">{p.partido || 'Partido desconocido'}</div>

            {/* Action buttons */}
            <div className="drawer-actions">
              <button className="drawer-action-btn" onClick={handleShare}>
                <ShareIcon /> Compartir
              </button>
              <button className="drawer-action-btn" onClick={() => onShowHistory?.(barrio)}>
                <HistoryIcon /> Histórico
              </button>
              <button className="drawer-action-btn" onClick={() => onShowRights?.(barrio)}>
                <RightsIcon /> Derechos
              </button>
              <button className="drawer-action-btn" onClick={() => onShowPhotos?.(barrio)}>
                <PhotoIcon /> Fotos
              </button>
            </div>

            {/* Stats */}
            <div className="drawer-stats">
              <div className="stat-card">
                <div className="stat-label">Superficie</div>
                <div className="stat-value">{m2ToHa(p.superficie_m2)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Familias</div>
                <div className="stat-value">{formatFamilias(p.cantidad_familias_aproximada)}</div>
              </div>
            </div>

            {/* Services */}
            <div className="drawer-section-label">Servicios</div>
            <div className="chips-row">
              <ServiceChip label="Agua" value={p.agua_corriente} />
              <ServiceChip label="Luz" value={p.energia_electrica} />
              <ServiceChip label="Cloaca" value={p.cloaca} />
            </div>

            {/* Urbanization */}
            {p.estado_de_urbanizacion && (
              <div className="drawer-urbanizacion">
                Urbanización: <span>{p.estado_de_urbanizacion}</span>
              </div>
            )}

            {/* Distance */}
            {distanceText && (
              <div className="drawer-distance">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="12" x2="15" y2="15"/>
                </svg>
                <strong>{distanceText}</strong> desde tu búsqueda
              </div>
            )}

            {/* Censo 2022 */}
            {censo && (
              <>
                <div className="drawer-section-label">Partido — Censo 2022</div>
                <div className="census-card">
                  <div className="census-row">
                    <span>Población</span>
                    <strong>{formatPoblacion(censo.poblacion)}</strong>
                  </div>
                  <div className="census-row">
                    <span>Hogares</span>
                    <strong>{formatPoblacion(censo.hogares)}</strong>
                  </div>
                  <div className="census-row">
                    <span>Densidad</span>
                    <strong>{censo.densidad.toLocaleString('es-AR')} hab/km²</strong>
                  </div>
                </div>
              </>
            )}

            {/* Photos preview (Supabase) */}
            {supapbasePhotos.length > 0 && (
              <>
                <div className="drawer-section-label">Fotos</div>
                <div className="photo-grid">
                  {supapbasePhotos.slice(0, 5).map((ph, i) => (
                    <div key={i} className="photo-thumb">
                      <img src={ph.url} alt={ph.caption || 'Foto del barrio'} loading="lazy" />
                    </div>
                  ))}
                  <button className="photo-add-btn" onClick={() => onShowPhotos?.(barrio)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Agregar
                  </button>
                </div>
              </>
            )}

            {supapbasePhotos.length === 0 && (
              <button
                className="drawer-action-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={() => onShowPhotos?.(barrio)}
              >
                <PhotoIcon /> Agregar fotos del barrio
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
