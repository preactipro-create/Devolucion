import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'legumex_session'

// TODO(backend): reemplazar esta lista y la función login() por una llamada
// real, por ejemplo: POST /api/auth/login -> { name, role, token }
// Mientras no exista base de datos, estos usuarios "demo" permiten probar
// los flujos de admin vs usuario normal.
const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
  { username: 'usuario', password: 'usuario123', name: 'Usuario TI', role: 'user' },
]

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // almacenamiento no disponible, se ignora silenciosamente
    }
  }, [user])

  function login(username, password) {
    const match = DEMO_USERS.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    )
    if (!match) {
      throw new Error('Usuario o contraseña incorrectos')
    }
    const { password: _omit, ...safeUser } = match
    setUser(safeUser)
    return safeUser
  }

  function logout() {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
