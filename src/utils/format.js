export function m2ToHa(m2) {
  if (!m2) return '—';
  return (m2 / 10000).toFixed(1) + ' ha';
}

export function formatFamilias(n) {
  if (!n) return '—';
  return Number(n).toLocaleString('es-AR');
}
