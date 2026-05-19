// Persiste snapshots de barrios en localStorage para mostrar historial local

const KEY = 'barrio_history';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function saveSnapshot(barrioId, props) {
  const all = load();
  if (!all[barrioId]) all[barrioId] = [];
  const last = all[barrioId].at(-1);
  const TRACKED = ['estado_de_urbanizacion', 'agua_corriente', 'energia_electrica', 'cloaca', 'cantidad_familias_aproximada'];
  const hasChange = !last || TRACKED.some(k => last.data[k] !== props[k]);
  if (hasChange) {
    all[barrioId].push({ date: new Date().toISOString(), data: { ...props } });
    save(all);
  }
}

export function getHistory(barrioId) {
  return load()[barrioId] || [];
}

const FIELD_LABELS = {
  estado_de_urbanizacion: 'Urbanización',
  agua_corriente: 'Agua',
  energia_electrica: 'Luz',
  cloaca: 'Cloaca',
  cantidad_familias_aproximada: 'Familias',
};

export function diffSnapshots(older, newer) {
  const changes = [];
  for (const [k, label] of Object.entries(FIELD_LABELS)) {
    if (older[k] !== newer[k]) {
      changes.push({ field: label, from: older[k], to: newer[k] });
    }
  }
  return changes;
}
