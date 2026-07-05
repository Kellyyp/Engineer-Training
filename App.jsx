import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChillerPlant from './components/ChillerPlant'
import Placeholder from './components/Placeholder'
import { buildingSystems } from './data/systems'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openView = (view) => {
    setActiveView(view)
    setSidebarOpen(false)
  }

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
            <p className="eyebrow">Version 5.0.0 · Part 1</p>
            <h2>Engineer Training Hub</h2>
          </div>
        </header>

        {activeView === 'dashboard' && <Dashboard openView={openView} />}
        {activeView === 'systems' && <Dashboard openView={openView} />}
        {activeView === 'chiller-plant' && <ChillerPlant openView={openView} />}

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
