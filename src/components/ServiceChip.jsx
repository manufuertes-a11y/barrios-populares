export default function ServiceChip({ label, value }) {
  const norm = String(value || '').toUpperCase().trim();
  let cls, icon;
  if (norm === 'SI') {
    cls = 'chip chip-si'; icon = '✓';
  } else if (norm === 'NO') {
    cls = 'chip chip-no'; icon = '✗';
  } else {
    cls = 'chip chip-parc'; icon = '~';
  }
  return (
    <span className={cls}>
      {icon} {label}
    </span>
  );
}
