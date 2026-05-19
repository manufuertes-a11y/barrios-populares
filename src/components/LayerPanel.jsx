const LAYERS = [
  {
    id: 'flood',
    name: 'Inundaciones',
    desc: 'Riesgo hídrico IGN',
    dot: '#3b82f6',
    static: true,
  },
  {
    id: 'health',
    name: 'Salud',
    desc: 'Hospitales y centros',
    dot: '#60a5fa',
  },
  {
    id: 'schools',
    name: 'Educación',
    desc: 'Escuelas y colegios',
    dot: '#a3e635',
  },
  {
    id: 'transit',
    name: 'Transporte',
    desc: 'Paradas de colectivo',
    dot: '#fb923c',
  },
  {
    id: 'police',
    name: 'Seguridad',
    desc: 'Comisarías',
    dot: '#f472b6',
  },
];

export default function LayerPanel({ open, onClose, active, loadingLayers, onToggle }) {
  return (
    <>
      <div
        className={`layer-panel-overlay${open ? ' open' : ''}`}
        onClick={onClose}
      >
        <div
          className={`layer-panel${open ? ' open' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="layer-panel-handle">
            <div className="layer-panel-bar" />
          </div>

          <div className="layer-panel-title">Capas de información</div>

          <div className="layer-section-label">Riesgo y servicios</div>
          <div className="layer-grid">
            {LAYERS.map(layer => (
              <button
                key={layer.id}
                className={`layer-toggle${active[layer.id] ? ' active' : ''}`}
                onClick={() => onToggle(layer.id)}
              >
                <div
                  className="layer-toggle-dot"
                  style={{ background: layer.dot, opacity: active[layer.id] ? 1 : 0.4 }}
                />
                <div className="layer-toggle-name">{layer.name}</div>
                <div className="layer-toggle-desc">{layer.desc}</div>
                {loadingLayers[layer.id] && <div className="layer-toggle-loading" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
