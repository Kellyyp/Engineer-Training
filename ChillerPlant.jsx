import { chillerPlantEquipment } from '../data/systems'

export default function ChillerPlant({ openView }) {
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

          <button className="plantNode tower">Cooling Towers</button>
          <button className="plantNode cwp">CW Pumps</button>
          <button className="plantNode chiller">Chillers</button>
          <button className="plantNode chwp">CHW Pumps</button>
          <button className="plantNode exp">Expansion Tank</button>
          <button className="plantNode hx">Plate HX</button>
          <button className="plantNode building">Building Load</button>
        </section>

        <aside className="plantSide">
          <p className="eyebrow">Equipment Groups</p>
          <h2>Clickable plant assets</h2>
          <p>Part 1 establishes the React foundation. Next releases will open each asset into a detailed AI-style equipment viewer.</p>

          <div className="equipmentList">
            {chillerPlantEquipment.map((item) => (
              <button key={item.id} className="equipmentItem">
                <strong>{item.name}</strong>
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
