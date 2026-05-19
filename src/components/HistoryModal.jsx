import { getHistory, diffSnapshots } from '../utils/history';

export default function HistoryModal({ barrio, onClose }) {
  if (!barrio) return null;

  const barrioId = barrio.properties?.id || barrio.properties?.nombre_barrio;
  const history = getHistory(barrioId);
  const current = barrio.properties;

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Historial</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {current.nombre_barrio}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {history.length === 0 ? (
            <>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>
                Aún no hay registros previos para este barrio. La app guarda cambios automáticamente cada vez que cargás los datos.
              </div>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot current" />
                  <div className="timeline-date">Hoy — primer registro</div>
                  <div className="timeline-content">
                    <div className="timeline-change">
                      Estado: <span className="tag-new">{current.estado_de_urbanizacion || '—'}</span>
                    </div>
                    <div className="timeline-change">
                      Agua: <span className="tag-new">{current.agua_corriente || '—'}</span>
                    </div>
                    <div className="timeline-change">
                      Luz: <span className="tag-new">{current.energia_electrica || '—'}</span>
                    </div>
                    <div className="timeline-change">
                      Cloaca: <span className="tag-new">{current.cloaca || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="timeline">
              {history.map((snap, i) => {
                const next = history[i + 1]?.data || current;
                const changes = i < history.length - 1
                  ? diffSnapshots(snap.data, history[i + 1].data)
                  : [];
                const isLast = i === history.length - 1;

                return (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot${changes.length > 0 ? ' change' : ''}${isLast ? ' current' : ''}`} />
                    <div className="timeline-date">{fmtDate(snap.date)}</div>
                    <div className="timeline-content">
                      {changes.length === 0 && isLast && (
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          Estado actual — sin cambios recientes
                        </div>
                      )}
                      {changes.map((c, j) => (
                        <div key={j} className="timeline-change">
                          {c.field}:{' '}
                          <span className="tag-old">{c.from || '—'}</span>
                          {' → '}
                          <span className="tag-new">{c.to || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 20, padding: 12, background: 'var(--surface2)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            Los cambios se detectan automáticamente comparando las actualizaciones del dataset oficial del ReNaBaP (SISU Argentina).
          </div>
        </div>
      </div>
    </div>
  );
}
