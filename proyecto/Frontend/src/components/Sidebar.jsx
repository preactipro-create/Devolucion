import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex items-center gap-4 px-4 py-3 rounded-lg font-body-md transition-all duration-200 active:translate-x-1 group',
          isActive
            ? 'bg-secondary-container text-on-secondary-container font-bold border-l-4 border-secondary'
            : 'text-on-surface-subtle hover:bg-surface-container-highest',
        ].join(' ')
      }
    >
      <span
        className="material-symbols-outlined group-hover:scale-110 transition-transform"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        {icon}
      </span>
      <span className="font-label-bold text-label-bold">{label}</span>
    </NavLink>
  )
}

function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="hidden md:flex flex-col py-stack-lg bg-surface-container fixed left-0 top-0 h-full w-drawer-width border-r border-outline-variant z-40">
      {/* Header */}
      <div className="px-stack-lg mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              factory
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-extrabold text-primary">
              Control Operativo
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Administración 
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        <NavItem to="/" icon="assignment_return" label="Hoja de Devolución" end />
        <NavItem to="/historial" icon="history_edu" label="Historial de Actas" />
        {isAdmin && <NavItem to="/auditoria" icon="rule_folder" label="Auditoría" />}
      </div>

      {/* Footer: usuario actual + cerrar sesión */}
      <div className="px-4 mt-auto pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-bold text-label-bold shrink-0">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="font-label-bold text-label-bold text-on-surface truncate">{user?.name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant capitalize">
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-subtle font-body-md hover:bg-surface-container-highest hover:text-error transition-all duration-200 active:translate-x-1 group"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
            logout
          </span>
          <span className="font-label-bold text-label-bold">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  )
}

export default Sidebar
