import { Outlet, NavLink } from 'react-router-dom'
import { CalendarDays, CheckSquare, FileText, BarChart2, Layout as BoardIcon } from 'lucide-react'

const nav = [
  { to: '/', label: 'Home', icon: CalendarDays },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/tracker', label: 'Tracker', icon: BarChart2 },
  { to: '/board', label: 'Board', icon: BoardIcon },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 gap-6 border-r border-white/10 bg-zinc-900">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}