// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Navbar() {
  const { signOut } = useAuthContext()

  const handleSignOut = async () => {
    try { await signOut() }
    catch (err) { console.error(err) }
  }

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-logo">⚡</span>
        <span className="navbar-title">TaskApp</span>
      </div>

      {/* Links */}
      <div className="navbar-links">
        <NavLink to="/"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          📋 Mis Tareas
        </NavLink>
        <NavLink to="/dashboard"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/profile"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          👤 Perfil
        </NavLink>
      </div>

      {/* Salir */}
      <div className="navbar-right">
        <button className="navbar-signout" onClick={handleSignOut}>
          Salir
        </button>
      </div>
    </nav>
  )
}