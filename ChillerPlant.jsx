import { chillerPlantEquipment } from '../data/systems'

export default function ChillerPlant({ openEquipment, openView }) {
  return (
    <div>
      <section className="plantHero">
        <div>
          <p className="eyebrow">Plant Explorer</p>
          <h1>Chiller Plant</h1>
          <p>
            Explore the complete chilled water plant as one connected system:
            towers, condenser water, chillers, chilled water distribution,
            VFDs, sensors, BAS points, and fault response.
          </p>
        </div>
        <button className="primaryBtn">Start Plant Sequence</button>
      </section>

      <div className="plantLayout">
        <section className="plantDiagram">
          <div className="plantPipe vertical" />
          <div className="plantPipe horizontal" />

          <button className="plantNode tower" onClick={() => openEquipment('cooling-towers')}>Cooling Towers</button>
          <button className="plantNode cwp" onClick={() => openEquipment('cw-pumps')}>CW Pumps</button>
          <button className="plantNode chiller" onClick={() => openEquipment('chillers')}>Chillers</button>
          <button className="plantNode chwp" onClick={() => openEquipment('chw-pumps')}>CHW Pumps</button>
          <button className="plantNode exp" onClick={() => openEquipment('expansion-tank')}>Expansion Tank</button>
          <button className="plantNode hx" onClick={() => openEquipment('plate-hx')}>Plate HX</button>
          <button className="plantNode building">Building Load</button>
        </section>

        <aside className="plantSide">
          <p className="eyebrow">Equipment Groups</p>
          <h2>Clickable plant assets</h2>
          <p>Select any equipment group to open the detailed training viewer with components, BAS points, specs, and troubleshooting guidance.</p>

          <div className="equipmentList">
            {chillerPlantEquipment.map((item) => (
              <button key={item.id} className="equipmentItem" onClick={() => openEquipment(item.id)}>
                <strong>{item.icon} {item.name}</strong>
                <span>{item.type}</span>
              </button>
            ))}
          </div>

          <button className="secondaryBtn full" onClick={() => openView('systems')}>Back to Building Systems</button>
        </aside>
      </div>
    </div>
  )
}
