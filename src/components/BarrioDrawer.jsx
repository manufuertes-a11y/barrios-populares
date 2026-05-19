import ServiceChip from './ServiceChip';
import { m2ToHa, formatFamilias } from '../utils/format';
import { formatDistance } from '../utils/geo';

export default function BarrioDrawer({ barrio, onClose, searchPosition }) {
  const isOpen = !!barrio;
  const p = barrio?.properties || {};

  // Compute centroid from geometry for distance calc
  let barrioLat = null, barrioLng = null;
  if (barrio?.geometry) {
    const coords = barrio.geometry.type === 'Polygon'
      ? barrio.geometry.coordinates[0]
      : barrio.geometry.type === 'MultiPolygon'
        ? barrio.geometry.coordinates[0][0]
        : [];
    if (coords.length) {
      barrioLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      barrioLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    }
  }

  const distanceText =
    searchPosition && barrioLat !== null
      ? formatDistance(searchPosition.lat, searchPosition.lng, barrioLat, barrioLng)
      : null;

  return (
    <div className={`drawer-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div
        className={`drawer${isOpen ? ' open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-handle" onClick={onClose}>
          <div className="drawer-handle-bar" />
        </div>

        {barrio && (
          <div className="drawer-content">
            <div className="drawer-name">{p.nombre_barrio || 'Barrio sin nombre'}</div>
            <div className="drawer-partido">{p.partido || 'Partido desconocido'}</div>

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

            <div className="drawer-section-label">Servicios</div>
            <div className="chips-row">
              <ServiceChip label="Agua" value={p.agua_corriente} />
              <ServiceChip label="Luz" value={p.energia_electrica} />
              <ServiceChip label="Cloaca" value={p.cloaca} />
            </div>

            {p.estado_de_urbanizacion && (
              <div className="drawer-urbanizacion">
                Urbanización: <span>{p.estado_de_urbanizacion}</span>
              </div>
            )}

            {distanceText && (
              <div className="drawer-distance">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="12" x2="15" y2="15" />
                </svg>
                <span><strong>{distanceText}</strong> desde tu búsqueda</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
