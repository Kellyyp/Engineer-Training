import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChillerPlant from './components/ChillerPlant'
import EquipmentDetail from './components/EquipmentDetail'
import Placeholder from './components/Placeholder'
import { buildingSystems, chillerPlantEquipment } from './data/systems'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('chillers')

  const openView = (view) => {
    setActiveView(view)
    setSidebarOpen(false)
  }

  const openEquipment = (id) => {
    setSelectedEquipmentId(id)
    setActiveView('equipment-detail')
    setSidebarOpen(false)
  }

  const selectedEquipment =
    chillerPlantEquipment.find((item) => item.id === selectedEquipmentId) ||
    chillerPlantEquipment[0]

  const currentSystem = buildingSystems.find((system) => system.id === activeView)

  return (
    <div className="appShell">
      <Sidebar activeView={activeView} setActiveView={openView} open={sidebarOpen} />

      <main className="workspace">
        <header className="topbar">
          <button className="mobileMenu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">Version 5.0.1 · Part 2</p>
            <h2>Engineer Training Hub</h2>
          </div>
        </header>

        {activeView === 'dashboard' && <Dashboard openView={openView} />}
        {activeView === 'systems' && <Dashboard openView={openView} />}
        {activeView === 'chiller-plant' && <ChillerPlant openView={openView} openEquipment={openEquipment} />}
        {activeView === 'equipment-detail' && (
          <EquipmentDetail
            equipment={selectedEquipment}
            onBack={() => setActiveView('chiller-plant')}
          />
        )}

        {currentSystem && activeView !== 'chiller-plant' && (
          <Placeholder
            title={currentSystem.title}
            text={`${currentSystem.title} is part of the Building Systems roadmap. Chiller Plant is the first system being built into the full Plant Explorer experience.`}
          />
        )}

        {activeView === 'bas' && (
          <Placeholder title="BAS Simulator" text="Future release: realistic BAS pages, point graphics, alarms, trends, and operating sequences." />
        )}
        {activeView === 'scada' && (
          <Placeholder title="SCADA Training" text="Future release: central plant control room, trend overlays, energy view, and alarm response." />
        )}
        {activeView === 'study' && (
          <Placeholder title="Study Center" text="Future release: flashcards, references, practice exams, and troubleshooting reviews." />
        )}
        {activeView === 'settings' && (
          <Placeholder title="Settings" text="Future release: preferences, progress, saved modules, and training configuration." />
        )}
      </main>
    </div>
  )
}
