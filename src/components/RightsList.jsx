const RIGHTS = [
  {
    icon: '🏠',
    title: 'Derecho a la vivienda digna',
    desc: 'Toda persona tiene derecho a una vivienda adecuada. El Estado debe garantizar condiciones habitacionales dignas.',
    law: 'Art. 14 bis CN · Art. 25 DUDH · Ley 27.453',
    action: 'Contactar SISU',
    actionUrl: 'https://www.argentina.gob.ar/habitat/integracion-socio-urbana',
  },
  {
    icon: '🏙️',
    title: 'Derecho a la urbanización',
    desc: 'Los barrios registrados en el ReNaBaP tienen derecho a ser urbanizados e integrados a la ciudad formal.',
    law: 'Ley 27.453 — RENABAP',
    action: 'Ver estado en ReNaBaP',
    actionUrl: 'https://www.argentina.gob.ar/habitat/integracion-socio-urbana/renabap',
  },
  {
    icon: '💧',
    title: 'Derecho al agua potable y saneamiento',
    desc: 'Acceso a agua segura y saneamiento básico (cloacas). Es un derecho humano reconocido por la ONU.',
    law: 'Resolución ONU 64/292 · Ley 26.221',
    action: 'Denunciar a ERAS',
    actionUrl: 'https://www.argentina.gob.ar/interior/obras-sanitarias/eras',
  },
  {
    icon: '⚡',
    title: 'Derecho a la energía eléctrica',
    desc: 'Acceso a electricidad segura y regular. Los cortes discriminatorios o la negativa de conexión son ilegales.',
    law: 'Ley 24.065 · ENRE',
    action: 'Reclamo al ENRE',
    actionUrl: 'https://www.enre.gov.ar/web/enre.nsf/reclamos',
  },
  {
    icon: '🏥',
    title: 'Derecho a la salud',
    desc: 'Acceso gratuito al sistema de salud público. No puede negarse atención de emergencia a ninguna persona.',
    law: 'Art. 42 CN · Ley 23.661',
    action: 'Ver hospitales cercanos',
    layer: 'health',
  },
  {
    icon: '🎓',
    title: 'Derecho a la educación',
    desc: 'La educación primaria y secundaria es obligatoria y gratuita. El Estado debe garantizar vacantes.',
    law: 'Art. 14 CN · Ley 26.206',
    action: 'Ver escuelas cercanas',
    layer: 'schools',
  },
  {
    icon: '🚌',
    title: 'Derecho al transporte',
    desc: 'Acceso a servicios de transporte público. Los barrios sin cobertura pueden solicitarla ante autoridades de tránsito.',
    law: 'Ley 26.363 · Resoluciones CNRT',
    action: 'Reclamar al CNRT',
    actionUrl: 'https://www.argentina.gob.ar/cnrt',
  },
  {
    icon: '📬',
    title: 'Derecho al domicilio legal',
    desc: 'Poder registrar una dirección formal para acceder a DNI, votar, recibir correspondencia y acceder a servicios.',
    law: 'Ley 17.671 — RENAPER',
    action: 'Tramitar en RENAPER',
    actionUrl: 'https://www.argentina.gob.ar/interior/renaper',
  },
  {
    icon: '🛡️',
    title: 'Derecho a no ser desalojado',
    desc: 'Ningún desalojo puede realizarse sin orden judicial. Ante una amenaza de desalojo, tenés derecho a defensa legal.',
    law: 'Art. 17 CN · Ley 24.374 · Código Civil',
    action: 'Defensoría del Pueblo',
    actionUrl: 'https://www.dpn.gob.ar/',
  },
  {
    icon: '📋',
    title: 'Derecho a la regularización dominial',
    desc: 'Los ocupantes de larga data pueden regularizar la tenencia de su vivienda y acceder a la escritura.',
    law: 'Ley 24.374 · Ley 27.453',
    action: 'Consultar en SISU',
    actionUrl: 'https://www.argentina.gob.ar/habitat/integracion-socio-urbana',
  },
];

export default function RightsList({ barrio, onClose, onActivateLayer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Derechos del vecino</div>
            {barrio && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {barrio.properties?.nombre_barrio}
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body" style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            Estos son los derechos que vos y tus vecinos tienen, aunque no siempre se cumplan. Podés reclamarlos.
          </div>

          <ul className="rights-list">
            {RIGHTS.map((r, i) => (
              <li key={i} className="rights-item">
                <div className="rights-title">
                  <span className="rights-title-icon">{r.icon}</span>
                  {r.title}
                </div>
                <div className="rights-desc">{r.desc}</div>
                <div className="rights-law">{r.law}</div>
                {r.actionUrl && (
                  <a
                    href={r.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rights-action"
                    style={{ display: 'inline-flex', textDecoration: 'none', marginTop: 6 }}
                  >
                    ↗ {r.action}
                  </a>
                )}
                {r.layer && onActivateLayer && (
                  <button
                    className="rights-action"
                    onClick={() => { onActivateLayer(r.layer); onClose(); }}
                  >
                    ◎ {r.action}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
