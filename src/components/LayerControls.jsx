export default function LayerControls({
  showHealth,
  showPolice,
  loadingHealth,
  loadingPolice,
  onToggleHealth,
  onTogglePolice,
}) {
  return (
    <div className="layer-controls">
      <button
        className={`layer-btn${showHealth ? ' active' : ''}`}
        onClick={onToggleHealth}
        disabled={loadingHealth}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        {loadingHealth ? 'Cargando...' : 'Salud'}
      </button>
      <button
        className={`layer-btn${showPolice ? ' active' : ''}`}
        onClick={onTogglePolice}
        disabled={loadingPolice}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        {loadingPolice ? 'Cargando...' : 'Seguridad'}
      </button>
    </div>
  );
}
