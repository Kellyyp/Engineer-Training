import { Home, Building2, MonitorCog, Activity, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'systems', label: 'Building Systems', icon: Building2 },
  { id: 'bas', label: 'BAS Simulator', icon: MonitorCog },
  { id: 'scada', label: 'SCADA Training', icon: Activity },
  { id: 'study', label: 'Study Center', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeView, setActiveView, open }) {
  return (
    <aside className={`sidebar ${open ? 'sidebarOpen' : ''}`}>
      <div className="brand">
        <div className="brandMark">ETH</div>
        <div>
          <strong>Engineer Training Hub</strong>
          <span>Version 5 Foundation</span>
        </div>
      </div>

      <nav className="navList">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`navButton ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
