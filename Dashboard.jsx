import { buildingSystems } from '../data/systems'
import SystemCard from './SystemCard'

export default function Dashboard({ openView }) {
  return (
    <>
      <section className="hero">
        <div className="heroMain">
          <p className="eyebrow">Engineer Training Hub v5</p>
          <h1>Professional building systems training.</h1>
          <p>
            Learn commercial buildings by system: central plants, BAS operation,
            SCADA workflows, equipment components, alarms, and troubleshooting.
          </p>
          <div className="heroActions">
            <button className="primaryBtn" onClick={() => openView('systems')}>Enter Building Systems</button>
            <button className="secondaryBtn" onClick={() => openView('chiller-plant')}>Open Chiller Plant</button>
          </div>
        </div>

        <div className="statusPanel">
          <span className="statusDot" />
          <p className="eyebrow">Platform Status</p>
          <h3>React foundation online</h3>
          <p>Version 5 Part 1 sets the new structure for Plant Explorer, BAS, SCADA, and equipment training.</p>
        </div>
      </section>

      <section className="sectionHeader">
        <div>
          <p className="eyebrow">Building Systems</p>
          <h2>Choose what you want to learn.</h2>
        </div>
      </section>

      <div className="systemGrid">
        {buildingSystems.map((system) => (
          <SystemCard key={system.id} system={system} onOpen={openView} />
        ))}
      </div>
    </>
  )
}
