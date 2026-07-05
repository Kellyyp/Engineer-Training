import { useMemo, useState } from 'react'

const modes = ['AI View', 'Components', 'Flow', 'Maintenance', 'BAS Points', 'Troubleshooting']

export default function EquipmentDetail({ equipment, onBack }) {
  const [activeMode, setActiveMode] = useState('AI View')
  const [componentIndex, setComponentIndex] = useState(0)

  const component = equipment.components[componentIndex] || equipment.components[0]

  const modeText = useMemo(() => {
    if (activeMode === 'Flow') return `Flow mode explains how ${equipment.name} affects the chilled water plant. Review entering/leaving conditions and confirm flow proof.`
    if (activeMode === 'Maintenance') return `Maintenance mode focuses on inspection points, PM tasks, vibration, leaks, heat, pressure, and safe lockout/tagout.`
    if (activeMode === 'BAS Points') return `Related BAS points: ${equipment.points.join(', ')}.`
    if (activeMode === 'Troubleshooting') return `Troubleshooting starts with status, command, proof, alarms, safeties, and whether the equipment response matches the BAS command.`
    if (activeMode === 'Components') return `Select a component to learn its function, common failures, and what an engineer should check.`
    return `AI View is the main visual training mode for ${equipment.name}. Future releases will replace this schematic with high-resolution AI equipment artwork.`
  }, [activeMode, equipment])

  return (
    <div>
      <section className="detailTop">
        <button className="secondaryBtn" onClick={onBack}>← Back to Chiller Plant</button>
        <div>
          <p className="eyebrow">{equipment.type}</p>
          <h1>{equipment.name}</h1>
          <p>{equipment.description}</p>
        </div>
      </section>

      <div className="detailLayout">
        <main className="viewerPanel">
          <div className="modeTabs">
            {modes.map((mode) => (
              <button
                key={mode}
                className={activeMode === mode ? 'modeActive' : ''}
                onClick={() => setActiveMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="equipmentVisual">
            <EquipmentGraphic id={equipment.id} />
            {equipment.components.slice(0, 6).map((item, index) => (
              <button
                key={item.name}
                className={`hotspot ${componentIndex === index ? 'hotspotActive' : ''}`}
                style={hotspotStyle(index)}
                onClick={() => setComponentIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="specGrid">
            {Object.entries(equipment.specs).map(([label, value]) => (
              <div className="specCard" key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="sequencePanel">
            <p className="eyebrow">{activeMode}</p>
            <p>{modeText}</p>
            <p><strong>Operating sequence:</strong> {equipment.sequence}</p>
          </div>
        </main>

        <aside className="componentPanel">
          <p className="eyebrow">Components</p>
          <h2>{component.name}</h2>

          <div className="componentList">
            {equipment.components.map((item, index) => (
              <button
                key={item.name}
                className={componentIndex === index ? 'componentActive' : ''}
                onClick={() => setComponentIndex(index)}
              >
                <strong>{index + 1}. {item.name}</strong>
              </button>
            ))}
          </div>

          <div className="componentExplain">
            <p><strong>Function</strong></p>
            <p>{component.function}</p>
            <p><strong>Common failure signs</strong></p>
            <p>{component.failure}</p>
            <p><strong>BAS points</strong></p>
            <p>{equipment.points.join(', ')}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function hotspotStyle(index) {
  const spots = [
    { left: '16%', top: '52%' },
    { left: '31%', top: '34%' },
    { left: '48%', top: '52%' },
    { left: '62%', top: '35%' },
    { left: '76%', top: '52%' },
    { left: '86%', top: '35%' },
  ]
  return spots[index] || { left: '50%', top: '50%' }
}

function EquipmentGraphic({ id }) {
  if (id === 'chillers') {
    return (
      <svg viewBox="0 0 900 430">
        <rect x="120" y="170" width="520" height="160" rx="70" fill="#64748b" stroke="#cbd5e1" strokeWidth="8" />
        <rect x="180" y="260" width="340" height="45" rx="22" fill="#dbeafe" stroke="#28b6ff" strokeWidth="4" />
        <rect x="180" y="195" width="340" height="45" rx="22" fill="#dcfce7" stroke="#36d399" strokeWidth="4" />
        <circle cx="390" cy="250" r="48" fill="#fef3c7" stroke="#f59e0b" strokeWidth="5" />
        <rect x="690" y="190" width="120" height="100" rx="16" fill="#0f2c49" stroke="#28b6ff" strokeWidth="4" />
        <text x="315" y="255" fill="#0b1220" fontSize="22" fontWeight="900">CHILLER</text>
      </svg>
    )
  }

  if (id === 'cooling-towers') {
    return (
      <svg viewBox="0 0 900 430">
        <rect x="300" y="75" width="300" height="285" rx="24" fill="#334155" stroke="#cbd5e1" strokeWidth="8" />
        <circle cx="450" cy="130" r="58" fill="none" stroke="#cbd5e1" strokeWidth="9" />
        <rect x="350" y="230" width="200" height="82" fill="#0f766e" />
        <rect x="330" y="335" width="240" height="32" fill="#0f3a5a" stroke="#28b6ff" strokeWidth="4" />
        <text x="365" y="215" fill="#fff" fontSize="22" fontWeight="900">COOLING TOWER</text>
      </svg>
    )
  }

  if (id === 'expansion-tank') {
    return (
      <svg viewBox="0 0 900 430">
        <rect x="360" y="95" width="180" height="250" rx="80" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="8" />
        <line x1="450" y1="345" x2="450" y2="390" stroke="#28b6ff" strokeWidth="10" />
        <text x="350" y="220" fill="#08111f" fontSize="22" fontWeight="900">EXPANSION</text>
      </svg>
    )
  }

  if (id === 'plate-hx') {
    return (
      <svg viewBox="0 0 900 430">
        <rect x="260" y="135" width="380" height="180" rx="28" fill="#64748b" stroke="#cbd5e1" strokeWidth="8" />
        {[0,1,2,3,4,5].map((i) => <line key={i} x1={310+i*48} y1="155" x2={310+i*48} y2="295" stroke="#28b6ff" strokeWidth="5" />)}
        <line x1="160" y1="210" x2="260" y2="210" stroke="#28b6ff" strokeWidth="10" />
        <line x1="640" y1="240" x2="760" y2="240" stroke="#36d399" strokeWidth="10" />
        <text x="330" y="225" fill="#fff" fontSize="22" fontWeight="900">PLATE HX</text>
      </svg>
    )
  }

  if (id === 'vfds') {
    return (
      <svg viewBox="0 0 900 430">
        <rect x="310" y="80" width="280" height="290" rx="24" fill="#111827" stroke="#94a3b8" strokeWidth="8" />
        <rect x="355" y="125" width="190" height="70" rx="12" fill="#0f3a5a" stroke="#28b6ff" strokeWidth="4" />
        <circle cx="390" cy="265" r="32" fill="#28b6ff" />
        <circle cx="510" cy="265" r="32" fill="#36d399" />
        <text x="385" y="170" fill="#fff" fontSize="22" fontWeight="900">VFD</text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 900 430">
      <ellipse cx="330" cy="230" rx="110" ry="82" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="8" />
      <ellipse cx="330" cy="230" rx="52" ry="40" fill="#dbeafe" stroke="#28b6ff" strokeWidth="5" />
      <rect x="500" y="190" width="210" height="90" rx="22" fill="#111827" stroke="#94a3b8" strokeWidth="6" />
      <line x1="390" y1="230" x2="500" y2="230" stroke="#cbd5e1" strokeWidth="12" />
      <line x1="120" y1="230" x2="220" y2="230" stroke="#28b6ff" strokeWidth="12" />
      <line x1="710" y1="230" x2="800" y2="230" stroke="#28b6ff" strokeWidth="12" />
      <text x="275" y="355" fill="#fff" fontSize="24" fontWeight="900">CENTRIFUGAL PUMP</text>
    </svg>
  )
}
